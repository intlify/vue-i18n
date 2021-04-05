import chalk from 'chalk'
import fixpack from 'fixpack'
import path from 'path'
import { targets } from './utils'

;(async () => {
  const allTargets = await targets()
  const { default: defaultConfig } = await import(path.resolve(
    __dirname,
    '../node_modules/fixpack/config.json'
  ))
  const { default: rc } = await import(path.resolve(__dirname, '../node_modules/rc'))
  const config = rc('fixpack', defaultConfig)

  const allPackages = allTargets.map(target => {
    return {
      fullPath: path.resolve(__dirname, `../packages/${target}/package.json`),
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
