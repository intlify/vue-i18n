//
// Checks the built packages, after `pnpm build --all -t`:
//
// - `exports`, `main`, `module`, `types`, `unpkg` and `jsdelivr` point to files in the package
// - the bundler and Node.js builds keep `process.env.NODE_ENV` for `__DEV__`, for bundlers to replace
//

import { spawnSync } from 'node:child_process'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'
import { targets as allTargets } from './utils'

type Entry = {
  keys: string[]
  target: string
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = path.resolve(__dirname, '../packages')

const ENTRY_FIELDS = ['main', 'module', 'types', 'unpkg', 'jsdelivr']

// the browser and global builds replace `__DEV__` with `true` or `false`,
// and the stubs re-export the bundler builds
const RE_NOT_BUNDLER_BUILD = /\.(?:esm-browser|global)(?:\.prod)?\.js$|\.esm-bundler\.js$/

// the Node.js builds of these packages replace `__DEV__` with `false`
// (see `resolveReplace()` in `scripts/rolldown.ts`)
const NODE_BUILDS_WITHOUT_DEV = ['vue-i18n', 'petite-vue-i18n']

function collectEntries(value: unknown, keys: string[], entries: Entry[]): Entry[] {
  if (typeof value === 'string') {
    entries.push({ keys, target: value })
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => collectEntries(v, [...keys, String(i)], entries))
  } else if (value != null && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) {
      collectEntries(v, [...keys, key], entries)
    }
  }
  return entries
}

function packedFiles(pkgDir: string): Set<string> {
  // in a shell, since `pnpm` is `pnpm.cmd` on Windows
  const { status, stdout, stderr } = spawnSync('pnpm pack --dry-run --json', {
    cwd: pkgDir,
    encoding: 'utf8',
    shell: true
  })
  if (status !== 0) {
    throw new Error(`\`pnpm pack\` failed in ${pkgDir}\n${stderr}`)
  }
  const { files } = JSON.parse(stdout) as { files: { path: string }[] }
  return new Set(files.map(file => file.path))
}

async function checkEntries(target: string): Promise<{ count: number; errors: string[] }> {
  const pkgDir = path.resolve(packagesDir, target)
  const pkg = JSON.parse(await fs.readFile(path.resolve(pkgDir, 'package.json'), 'utf8'))
  const files = packedFiles(pkgDir)

  const entries = collectEntries(pkg.exports, ['exports'], [])
  // Node.js resolves only the targets of `exports` that start with `./`
  const errors = entries
    .filter(({ target }) => !target.startsWith('./'))
    .map(
      ({ keys, target }) =>
        `${pkg.name}: ${keys.join(' > ')} points to ${target}, which does not start with ./`
    )
  for (const field of ENTRY_FIELDS) {
    if (typeof pkg[field] === 'string') {
      entries.push({ keys: [field], target: pkg[field] })
    }
  }

  for (const { keys, target } of entries) {
    // a pattern such as `./dist/*` needs to match some files
    const pattern = target.includes('*') ? toPattern(target) : null
    const found = pattern
      ? [...files].some(file => pattern.test(file))
      : files.has(path.posix.normalize(target))
    if (!found) {
      errors.push(
        `${pkg.name}: ${keys.join(' > ')} points to ${target}, ` +
          (pattern ? 'which matches no files in the package' : 'which is not in the package')
      )
    }
  }
  return { count: entries.length, errors }
}

// `*` matches one or more characters, including `/`
function toPattern(target: string): RegExp {
  const source = path.posix
    .normalize(target)
    .split('*')
    .map(part => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.+')
  return new RegExp(`^${source}$`)
}

async function usesDev(srcDir: string): Promise<boolean> {
  for (const file of await fs.readdir(srcDir, { recursive: true })) {
    if (
      file.endsWith('.ts') &&
      !file.endsWith('.d.ts') &&
      (await fs.readFile(path.resolve(srcDir, file), 'utf8')).includes('__DEV__')
    ) {
      return true
    }
  }
  return false
}

async function checkDevBranches(target: string): Promise<{ count: number; errors: string[] }> {
  const pkgDir = path.resolve(packagesDir, target)
  // nothing to keep in the packages without `__DEV__`, such as `@intlify/core`
  if (!(await usesDev(path.resolve(pkgDir, 'src')))) {
    return { count: 0, errors: [] }
  }

  const files = (await fs.readdir(path.resolve(pkgDir, 'dist'))).filter(
    file =>
      file.endsWith('.js') &&
      !RE_NOT_BUNDLER_BUILD.test(file) &&
      !(NODE_BUILDS_WITHOUT_DEV.includes(target) && file.includes('.node.'))
  )

  const errors: string[] = []
  for (const file of files) {
    const source = await fs.readFile(path.resolve(pkgDir, 'dist', file), 'utf8')
    if (!source.includes('process.env.NODE_ENV')) {
      errors.push(
        `packages/${target}/dist/${file}: has no \`process.env.NODE_ENV\` checks, ` +
          `so its development-only code does not follow NODE_ENV`
      )
    }
  }
  return { count: files.length, errors }
}

async function main() {
  const targets = await allTargets()
  const unbuilt = targets.filter(target => !existsSync(path.resolve(packagesDir, target, 'dist')))
  if (unbuilt.length) {
    console.error(pc.red(`Not built: ${unbuilt.join(', ')}. Run \`pnpm build --all -t\` first.`))
    process.exit(1)
  }

  const errors: string[] = []
  let entryCount = 0
  let buildCount = 0

  for (const target of targets) {
    const entries = await checkEntries(target)
    const builds = await checkDevBranches(target)
    entryCount += entries.count
    buildCount += builds.count
    errors.push(...entries.errors, ...builds.errors)
  }

  if (errors.length) {
    for (const error of errors) {
      console.error(pc.red(error))
    }
    process.exit(1)
  }

  console.log(
    `${pc.green('✔')} ${targets.length} packages: ${entryCount} entry points are in the packages, ` +
      `and ${buildCount} bundler and Node.js builds keep \`process.env.NODE_ENV\``
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
