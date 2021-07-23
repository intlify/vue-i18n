import { promises as fs } from 'fs'
import chalk from 'chalk'

export const targets = async () => {
  const packages = await fs.readdir('packages')
  const files = await Promise.all(
    packages.map(async f => {
      const stat = await fs.stat(`packages/${f}`)
      if (!stat.isDirectory()) {
        return ''
      }
      const { default: pkg } = await import(`../packages/${f}/package.json`)
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
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `Target ${chalk.underline(partialTargets)} not found!`
      )}`
    )
    console.log()

    process.exit(1)
  }
}

export async function checkSizeDistFiles(target) {
  const dirs = await fs.readdir(`${target}/dist`)
  return dirs.filter(file => /prod.js$/.test(file))
}
