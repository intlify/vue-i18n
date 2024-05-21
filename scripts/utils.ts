import { promises as fs } from 'node:fs'
import { resolve, dirname } from 'pathe'
import pc from 'picocolors'

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
  includeAllMatching = null
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

export async function checkSizeDistFiles(target: string) {
  const dirs = await fs.readdir(`${target}/dist`)
  return dirs.filter(file => /prod.(cjs|js)$/.test(file))
}

export async function readJson(path: string) {
  const data = await fs.readFile(path, 'utf8')
  return JSON.parse(data)
}
