import chalk from 'chalk'
import fixpack from 'fixpack'
import { resolve, dirname } from 'pathe'
import rc from 'rc'
import { targets, readJson } from './utils'
;(async () => {
  const allTargets = await targets()
  const defaultConfig = await readJson(
    resolve(dirname('.'), './node_modules/fixpack/config.json')
  )
  const config = rc('fixpack', defaultConfig)

  const allPackages = allTargets.map(target => {
    return {
      fullPath: resolve(dirname('.'), `./packages/${target}/package.json`),
      display: `./packages/${target}/package.json`
    }
  })

  // fix packages
  allPackages.forEach(({ fullPath, display }) => {
    fixpack(fullPath, config)
    console.log(chalk.bold(`${display} fixed!`))
  })

  // fix root
  config.quiet = true
  delete config.required
  fixpack('package.json', config)
  console.log(chalk.bold(`./package.json fixed!`))
})()
