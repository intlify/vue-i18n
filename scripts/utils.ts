import { promises as fs } from 'node:fs'
import { dirname, resolve } from 'node:path'
import pc from 'picocolors'

export type BundleReport = {
  name: string
  size: number
  gzip: number
  brotli: number
}

export const targets = async () => {
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
      if (pkg.private || !pkg.buildOptions) {
        return ''
      }
      return f
    })
  )
  return files.filter((_, f) => files[f])
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
  return files.filter((_, f) => files[f]).filter(f => /size-check/.test(f))
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
