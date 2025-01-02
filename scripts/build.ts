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

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'
import { execa } from 'execa'
import { spawnSync } from 'node:child_process'
import { existsSync, promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import pc from 'picocolors'
import {
  targets as allTargets,
  checkSizeDistFiles,
  fuzzyMatchTarget,
  readJson
} from './utils'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const commit = spawnSync('git', ['rev-parse', '--short=7', 'HEAD'])
  .stdout.toString()
  .trim()

const { values, positionals: targets } = parseArgs({
  allowPositionals: true,
  options: {
    formats: {
      type: 'string',
      short: 'f'
    },
    devOnly: {
      type: 'boolean',
      short: 'd'
    },
    prodOnly: {
      type: 'boolean',
      short: 'p'
    },
    withTypes: {
      type: 'boolean',
      short: 't'
    },
    sourceMap: {
      type: 'boolean',
      short: 's'
    },
    release: {
      type: 'boolean'
    },
    all: {
      type: 'boolean',
      short: 'a'
    },
    size: {
      type: 'boolean'
    }
  }
})

const {
  formats: rawFormats,
  all: buildAllMatching,
  devOnly,
  prodOnly,
  withTypes: buildTypes,
  sourceMap,
  release: isRelease,
  size
} = values

const formats = rawFormats?.split(',')
const sizeDir = path.resolve(__dirname, '../temp/size')

async function main() {
  await run()

  async function run() {
    if (size) {
      await fs.mkdir(sizeDir, { recursive: true })
    }

    const rtsCachePath = path.resolve(__dirname, './node_modules/.rts2_cache')
    if (isRelease && existsSync(rtsCachePath)) {
      // remove build cache for release builds to avoid outdated enum values
      await fs.rm(rtsCachePath, { recursive: true })
    }

    const resolvedTargets = targets.length
      ? await fuzzyMatchTarget(targets, buildAllMatching)
      : await allTargets()
    await buildAll(resolvedTargets)

    if (size) {
      await checkAllSizes(resolvedTargets)
    }
  }

  async function buildAll(targets: string[]) {
    const start = performance.now()
    await runParallel(os.cpus().length, targets, build)
    console.log(`\nbuilt in ${(performance.now() - start).toFixed(2)}ms.`)
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

  async function build(target: string) {
    const pkgDir = path.resolve(__dirname, `../packages/${target}`)
    const pkg = await readJson(`${pkgDir}/package.json`)

    // only build published packages for release
    if (isRelease && pkg.private) {
      return
    }

    // if building a specific format, do not remove dist.
    if (!formats && existsSync(`${pkgDir}/dist`)) {
      await fs.rm(`${pkgDir}/dist`, { recursive: true })
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
        if (existsSync(typesDir)) {
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

      if (['vue-i18n', 'petite-vue-i18n'].includes(target)) {
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
          console.error('Failed in appending Vue type definitions', e)
          process.exitCode = 1
        }

        console.log(
          pc.bold(
            pc.green(`Appending Vue type definitions completed successfully.`)
          )
        )
      }

      await fs.rm(`${pkgDir}/dist/packages`, { recursive: true })
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
    if (!existsSync(filePath)) {
      return
    }
    const file = await fs.readFile(filePath)
    const filename = path.basename(filePath)

    const minSize = (file.length / 1024).toFixed(2) + 'kb'
    const gzipped = gzipSync(file)
    const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
    const compressed = brotliCompressSync(file)
    const compressedSize =
      compressed != null ? (compressed.length / 1024).toFixed(2) + 'kb' : 'N/A'
    console.log(
      `📦  ${pc.gray(
        pc.bold(path.basename(filePath))
      )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
    )

    if (size) {
      const sizeContents = JSON.stringify(
        {
          file: filename,
          size: file.length,
          gzip: gzipped.length,
          brotli: compressed.length
        },
        null,
        2
      )
      await fs.writeFile(
        path.resolve(sizeDir, `${filename}.json`),
        sizeContents,
        'utf-8'
      )
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
