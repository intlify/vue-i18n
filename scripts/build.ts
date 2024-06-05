/*
Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "core-base":
pnpm build core-base

# specify the format to output
pnpm build core --formats cjs
```
*/

import { promisify } from 'node:util'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import execa from 'execa'
import os from 'node:os'
import { gzip as _gzip } from 'node:zlib'
import { compress } from 'brotli'
import {
  targets as allTargets,
  fuzzyMatchTarget,
  checkSizeDistFiles,
  readJson
} from './utils'
import minimist from 'minimist'
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import { rimrafSync } from 'rimraf'

const gzip = promisify(_gzip)

async function main() {
  const args = minimist(process.argv.slice(2))
  let targets = args._
  const formats = args.formats || args.f
  const devOnly = args.devOnly || args.d
  const prodOnly = !devOnly && (args.prodOnly || args.p)
  const sourceMap = args.sourcemap || args.s
  const isRelease = args.release
  const buildTypes = args.t || args.types
  const buildAllMatching = args.all || args.a
  const { stdout } = await execa('git', ['rev-parse', 'HEAD'])
  const commit = stdout.slice(0, 7)

  await run()

  async function run() {
    if (isRelease) {
      // remove build cache for release builds to avoid outdated enum values
      rimrafSync(path.resolve(path.dirname('.'), './node_modules/.rts2_cache'))
    }
    if (!targets.length) {
      targets = await allTargets()
      await buildAll(targets)
      await checkAllSizes(targets)
    } else {
      targets = await fuzzyMatchTarget(targets, buildAllMatching)
      await buildAll(targets)
      await checkAllSizes(targets)
    }
  }

  async function buildAll(targets: string[]) {
    await runParallel(os.cpus().length, targets, build)
  }

  async function runParallel(
    maxConcurrency: number,
    source: string[],
    iteratorFn: (item: string, source: string[]) => Promise<void>
  ) {
    const ret: Promise<void>[] = []
    const executing: Promise<void>[] = []
    for (const item of source) {
      const p = Promise.resolve().then(() => iteratorFn(item, source))
      ret.push(p)

      if (maxConcurrency <= source.length) {
        // @ts-expect-error
        const e = p.then(() => executing.splice(executing.indexOf(e), 1))
        executing.push(e)
        if (executing.length >= maxConcurrency) {
          await Promise.race(executing)
        }
      }
    }
    return Promise.all(ret)
  }

  async function isExist(filePath: string) {
    try {
      await fs.access(filePath)
      return true
    } catch (e) {
      return false
    }
  }

  async function build(target: string) {
    const pkgDir = path.resolve(path.dirname('.'), `./packages/${target}`)
    const pkg = await readJson(`${pkgDir}/package.json`)

    // only build published packages for release
    if (isRelease && pkg.private) {
      return
    }

    // if building a specific format, do not remove dist.
    if (!formats) {
      rimrafSync(`${pkgDir}/dist`)
    }

    const env =
      (pkg.buildOptions && pkg.buildOptions.env) ||
      (devOnly ? 'development' : 'production')
    await execa(
      'rollup',
      [
        '-c',
        '--environment',
        [
          `COMMIT:${commit}`,
          `NODE_ENV:${env}`,
          `TARGET:${target}`,
          formats ? `FORMATS:${formats}` : ``,
          buildTypes ? `TYPES:true` : ``,
          prodOnly ? `PROD_ONLY:true` : ``,
          sourceMap ? `SOURCE_MAP:true` : ``
        ]
          .filter(Boolean)
          .join(',')
      ],
      { stdio: 'inherit' }
    )

    if (buildTypes && pkg.types) {
      console.log()
      console.log(
        pc.bold(pc.yellow(`Rolling up type definitions for ${target}...`))
      )

      // build types
      const extractorConfigPath = path.resolve(pkgDir, `api-extractor.json`)
      const extractorConfig =
        ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
      const extractorResult = Extractor.invoke(extractorConfig, {
        localBuild: true,
        showVerboseMessages: true
      })

      if (extractorResult.succeeded) {
        // concat additional d.ts to rolled-up dts
        const typesDir = path.resolve(pkgDir, 'types')
        if (await isExist(typesDir)) {
          const dtsPath = path.resolve(pkgDir, pkg.types)
          const existing = await fs.readFile(dtsPath, 'utf-8')
          const typeFiles = await fs.readdir(typesDir)
          const toAdd = await Promise.all(
            typeFiles.map(file =>
              fs.readFile(path.resolve(typesDir, file), 'utf-8')
            )
          )
          await fs.writeFile(dtsPath, existing + '\n' + toAdd.join('\n'))
        }
        console.log(pc.bold(pc.green(`API Extractor completed successfully.`)))
      } else {
        console.error(
          `API Extractor completed with ${extractorResult.errorCount} errors` +
            ` and ${extractorResult.warningCount} warnings`
        )
        process.exitCode = 1
      }

      if (['vue-i18n', 'pretite-vue-i18n'].includes(target)) {
        console.log()
        console.log(
          pc.bold(pc.yellow(`Appending Vue type definitions for ${target}...`))
        )

        let content = ''

        try {
          content = await fs.readFile(
            path.resolve(pkgDir, 'src/vue.d.ts'),
            'utf-8'
          )
        } catch (e) {
          console.error(
            `Failed in opening Vue type definition file with error code: ${(e as NodeJS.ErrnoException).code}`
          )
          process.exitCode = 1
        }

        try {
          const marker =
            '// --- THE CONTENT BELOW THIS LINE WILL BE APPENDED TO DTS FILE IN DIST DIRECTORY --- //'
          const data = content.slice(content.indexOf(marker) + marker.length)

          await fs.appendFile(path.resolve(pkgDir, `dist/${target}.d.ts`), data)
        } catch (e) {
          console.error('Failed in appending Vue type definitions')
          process.exitCode = 1
        }

        console.log(
          pc.bold(
            pc.green(`Appending Vue type definitions completed successfully.`)
          )
        )
      }

      rimrafSync(`${pkgDir}/dist/packages`)
    }
  }

  async function checkAllSizes(targets: string[]) {
    if (devOnly) {
      return
    }
    console.log()
    for (const target of targets) {
      await checkSize(target)
    }
    console.log()
  }

  async function checkSize(target: string) {
    const pkgDir = path.resolve(`packages/${target}`)
    const files = await checkSizeDistFiles(pkgDir)
    for (const file of files) {
      await checkFileSize(`${pkgDir}/dist/${file}`)
    }
  }

  async function checkFileSize(filePath: string) {
    if (!(await isExist(filePath))) {
      return
    }
    const file = await fs.readFile(filePath)
    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = await gzip(file)
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
    const compressed = compress(file)
    const compressedSize =
      compressed != null ? (compressed.length / 1024).toFixed(2) + 'kb' : 'N/A'
    console.log(
      `📦  ${pc.gray(
        pc.bold(path.basename(filePath))
      )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
    )
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
