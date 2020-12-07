const chalk = require('chalk')
const fixpack = require('fixpack')
const path = require('path')
const defaultConfig = require(path.resolve(
  __dirname,
  '../node_modules/fixpack/config.json'
))
const config = require('rc')('fixpack', defaultConfig)
const { targets: allTargets } = require('./utils')

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
