import pc from 'picocolors'
// @ts-ignore
import fixpack from 'fixpack'
import { resolve, dirname } from 'node:path'
import rc from 'rc'
import { targets, readJson } from './utils'
// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    console.log(pc.bold(`${display} fixed!`))
  })

  // fix root
  config.quiet = true
  delete config.required
  fixpack('package.json', config)
  console.log(pc.bold(`./package.json fixed!`))
})()
