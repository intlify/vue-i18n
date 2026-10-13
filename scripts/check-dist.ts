//
// Checks the built packages, after `pnpm build --all -t`:
//
// - `exports`, `main`, `module`, `types`, `unpkg` and `jsdelivr` point to files in the package
// - the bundler and Node.js builds keep `process.env.NODE_ENV` for `__DEV__`, for bundlers to replace
// - the type declarations import only the packages in `dependencies` and `peerDependencies`
// - the type declarations have no type errors with `skipLibCheck: false`
//

import { spawnSync } from 'node:child_process'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'
import ts from 'typescript'
import { targets as allTargets } from './utils'

type Entry = {
  keys: string[]
  target: string
}

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.resolve(rootDir, 'packages')

const ENTRY_FIELDS = ['main', 'module', 'types', 'unpkg', 'jsdelivr']

// the browser and global builds replace `__DEV__` with `true` or `false`,
// and the stubs re-export the bundler builds
const RE_NOT_BUNDLER_BUILD = /\.(?:esm-browser|global)(?:\.prod)?\.js$|\.esm-bundler\.js$/

// the module resolutions that the projects of users type-check the declarations with
const DECLARATION_RESOLUTIONS: [name: string, options: ts.CompilerOptions][] = [
  ['bundler', { module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler }],
  ['node16', { module: ts.ModuleKind.Node16, moduleResolution: ts.ModuleResolutionKind.Node16 }]
]

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

const packedFilesCache = new Map<string, Set<string>>()

function packedFiles(pkgDir: string): Set<string> {
  const cached = packedFilesCache.get(pkgDir)
  if (cached) {
    return cached
  }
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
  const packed = new Set(files.map(file => file.path))
  packedFilesCache.set(pkgDir, packed)
  return packed
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

// `@scope/name/subpath` and `name/subpath` to the name of the package
function toPackageName(specifier: string): string {
  return specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/')
}

async function checkDeclarationImports(
  target: string
): Promise<{ count: number; errors: string[] }> {
  const pkgDir = path.resolve(packagesDir, target)
  const pkg = JSON.parse(await fs.readFile(path.resolve(pkgDir, 'package.json'), 'utf8'))
  // the packages that are installed together with this package
  const installed = new Set([
    pkg.name,
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {})
  ])
  const declarations = [...packedFiles(pkgDir)].filter(file => file.endsWith('.d.ts'))

  const errors: string[] = []
  for (const file of declarations) {
    const source = await fs.readFile(path.resolve(pkgDir, file), 'utf8')
    const { importedFiles, typeReferenceDirectives } = ts.preProcessFile(source, true, true)
    for (const { fileName: specifier } of [...importedFiles, ...typeReferenceDirectives]) {
      if (specifier.startsWith('.') || specifier.startsWith('node:')) {
        continue
      }
      if (!installed.has(toPackageName(specifier))) {
        errors.push(
          `${pkg.name}: ${file} imports ${specifier}, which is not in dependencies or peerDependencies`
        )
      }
    }
  }
  return { count: declarations.length, errors }
}

const diagnosticHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: fileName => fileName,
  getCurrentDirectory: () => rootDir,
  getNewLine: () => '\n'
}

function checkDeclarationTypes(target: string): string[] {
  const pkgDir = path.resolve(packagesDir, target)
  const declarations = [...packedFiles(pkgDir)]
    .filter(file => file.endsWith('.d.ts'))
    .map(file => path.resolve(pkgDir, file))

  const errors: string[] = []
  for (const [name, resolution] of DECLARATION_RESOLUTIONS) {
    // each package alone, as an application installs vue-i18n or petite-vue-i18n
    const program = ts.createProgram(declarations, {
      noEmit: true,
      strict: true,
      skipLibCheck: false,
      target: ts.ScriptTarget.ES2022,
      types: [],
      ...resolution
    })
    // check only the declarations of these packages, not the ones of other packages such as vue
    const diagnostics = [...program.getOptionsDiagnostics(), ...program.getGlobalDiagnostics()]
    for (const sourceFile of program.getSourceFiles()) {
      if (path.resolve(sourceFile.fileName).startsWith(packagesDir)) {
        diagnostics.push(
          ...program.getSyntacticDiagnostics(sourceFile),
          ...program.getSemanticDiagnostics(sourceFile)
        )
      }
    }
    for (const diagnostic of diagnostics) {
      errors.push(`${name}: ${ts.formatDiagnostic(diagnostic, diagnosticHost).trimEnd()}`)
    }
  }
  return errors
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
  let declarationCount = 0

  for (const target of targets) {
    const entries = await checkEntries(target)
    const builds = await checkDevBranches(target)
    const declarations = await checkDeclarationImports(target)
    entryCount += entries.count
    buildCount += builds.count
    declarationCount += declarations.count
    errors.push(
      ...entries.errors,
      ...builds.errors,
      ...declarations.errors,
      ...checkDeclarationTypes(target)
    )
  }

  if (errors.length) {
    // an error in a shared declaration, such as the one of @intlify/shared, shows up for each package
    for (const error of new Set(errors)) {
      console.error(pc.red(error))
    }
    process.exit(1)
  }

  console.log(
    `${pc.green('✔')} ${targets.length} packages: ${entryCount} entry points are in the packages, ` +
      `${buildCount} bundler and Node.js builds keep \`process.env.NODE_ENV\`, ` +
      `and ${declarationCount} type declarations import only their dependencies ` +
      `and have no type errors with \`skipLibCheck: false\``
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
