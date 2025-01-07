import { promises as fs } from 'node:fs'
import { dirname, resolve } from 'node:path'
import pc from 'picocolors'

export type BundleReport = {
  name: string
  size: number
  gzip: number
  brotli: number
}

const PKG_TARGET_ORDER = [
  'shared',
  'message-compiler',
  'devtools-types',
  'core-base',
  'core',
  'vue-i18n-core',
  'petite-vue-i18n',
  'vue-i18n'
]

function resolveTargets(targets: string[]) {
  return targets.sort((a, b) => {
    const ia = PKG_TARGET_ORDER.indexOf(a)
    const ib = PKG_TARGET_ORDER.indexOf(b)
    return ia > ib ? 1 : ia < ib ? -1 : 0
  })
}

export const targets = async () => {
  const packages = await fs.readdir('packages')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pkgCaches = new Map<string, any>()
  const files = await Promise.all(
    packages.map(async f => {
      const stat = await fs.stat(`packages/${f}`)
      if (!stat.isDirectory()) {
        return ''
      }
      const pkgfile = resolve(dirname(''), `./packages/${f}/package.json`)
      let pkg = pkgCaches.get(pkgfile)
      if (pkg == null) {
        pkg = await readJson(pkgfile)
        pkgCaches.set(pkgfile, pkg)
      }
      if (pkg.private || !pkg.buildOptions) {
        return ''
      }
      return f
    })
  )
  return resolveTargets(files.filter((_, f) => files[f]))
}

export const fuzzyMatchTarget = async (
  partialTargets: string[],
  includeAllMatching?: boolean
) => {
  const matched: string[] = []
  const _targets = await targets()
  partialTargets.forEach(partialTarget => {
    for (const target of _targets) {
      if (target.match(partialTarget)) {
        matched.push(target)
        if (!includeAllMatching) {
          break
        }
      }
    }
  })

  if (matched.length) {
    return matched
  } else {
    console.log()
    console.error(
      `  ${pc.bgRed(pc.white(' ERROR '))} ${pc.red(
        `Target ${pc.underline(partialTargets.join(','))} not found!`
      )}`
    )
    console.log()

    process.exit(1)
  }
}

export async function sizeTargets() {
  const packages = await fs.readdir('packages')
  const files = await Promise.all(
    packages.map(async f => {
      const stat = await fs.stat(`packages/${f}`)
      if (!stat.isDirectory()) {
        return ''
      }
      const pkg = await readJson(
        resolve(dirname(''), `./packages/${f}/package.json`)
      )
      if (!pkg.private) {
        return ''
      }
      return f
    })
  )
  return resolveTargets(
    files.filter((_, f) => files[f]).filter(f => /size-check/.test(f))
  )
}

export async function checkSizeDistFiles(target: string) {
  const dirs = await fs.readdir(`${target}/dist`)
  // prettier-ignore
  return dirs.filter(file => /^(message-compiler|core|vue-i18n|petite-vue-i18n)/.test(file))
    .filter(file => !/^core-base/.test(file))
    .filter(file => !/^vue-i18n-core/.test(file))
    .filter(file => /prod.(cjs|js)$/.test(file))
    .filter(file => !/cjs.prod.js$/.test(file))
}

export async function readJson(path: string) {
  const data = await fs.readFile(path, 'utf8')
  return JSON.parse(data)
}

const NUMBER_FORMATTER = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2
})

export function displaySize(bytes: number) {
  return `${NUMBER_FORMATTER.format(bytes / 1000)} kB`
}
