const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const execa = require('execa')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')

const args = require('minimist')(process.argv.slice(2))
const devOnly = args.devOnly || args.d
const prodOnly = !devOnly && (args.prodOnly || args.p)
const sourceMap = args.sourcemap || args.s
const buildTypes = args.t || args.types

run()

async function run() {
  await build()
  await checkSize()
}

async function build() {
  const pkgDir = path.resolve('./')
  const pkg = require(`${pkgDir}/package.json`)

  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
  }

  const env = devOnly ? 'development' : 'production'
  console.log(
    chalk.bold(chalk.yellow(`Building for ${env} mode as plugin ...`))
  )

  await execa(
    'rollup',
    [
      '-c',
      '--environment',
      [
        `NODE_ENV:${env}`,
        buildTypes ? `TYPES:true` : ``,
        prodOnly ? `PROD_ONLY:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``
      ]
        .filter(Boolean)
        .join(',')
    ],
    { stdio: 'inherit' }
  )

  console.log()
  console.log(
    chalk.bold(
      chalk.green(
        `✅  Build complete. The ${chalk.cyan(
          'dist'
        )} directory is ready to be deployed.`
      )
    )
  )
  console.log()

  if (buildTypes && pkg.types) {
    console.log(chalk.bold(chalk.yellow(`Rolling up type definitions ...`)))
    console.log()

    // build types
    const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

    const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
    const extractorConfig = ExtractorConfig.loadFileAndPrepare(
      extractorConfigPath
    )
    const result = Extractor.invoke(extractorConfig, {
      localBuild: true,
      showVerboseMessages: true
    })

    if (result.succeeded) {
      // concat additional d.ts to rolled-up dts (mostly for JSX)
      if (pkg.buildOptions && pkg.buildOptions.dts) {
        const dtsPath = path.resolve(pkgDir, pkg.types)
        const existing = await fs.readFile(dtsPath, 'utf-8')
        const toAdd = await Promise.all(
          pkg.buildOptions.dts.map(file => {
            return fs.readFile(path.resolve(pkgDir, file), 'utf-8')
          })
        )
        await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
      }
      console.log()
      console.log(
        chalk.bold(chalk.green(`✅  API Extractor completed successfully.`))
      )
      console.log()
    } else {
      console.log()
      console.error(
        `API Extractor completed with ${result.errorCount} errors` +
          ` and ${result.warningCount} warnings`
      )
      process.exitCode = 1
    }
    // await fs.remove(`${pkgDir}/dist/packages`)
  }
}

function checkSize() {
  if (devOnly) {
    return
  }
  console.log(chalk.bold(chalk.yellow(`Checking file size ...`)))
  console.log()

  const pkgDir = path.resolve('./')
  const esmProdBuild = `${pkgDir}/dist/vue-i18n.global.prod.js`
  if (fs.existsSync(esmProdBuild)) {
    const file = fs.readFileSync(esmProdBuild)
    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = gzipSync(file)
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
    const compressed = compress(file)
    const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
    console.log(
      `✅  ${chalk.gray(
        chalk.bold('vue-i18n')
      )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
    )
    console.log()
  }
}
