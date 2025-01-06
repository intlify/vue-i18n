import { glob } from 'fast-glob'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isolatedDeclaration } from 'oxc-transform'
import pc from 'picocolors'
import { rollup } from 'rollup'
import { createDtsConfig } from './dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const IGNORES = [
  /format-explorer/,
  /size-check-core/,
  /size-check-vue-i18n/,
  /size-check-vue-i18n/
]

function isIgnore(file: string) {
  let ignored = false
  for (const ignore of IGNORES) {
    if (ignore.test(file)) {
      ignored = true
      break
    }
  }
  return ignored
}

export async function buildTypings(targets: string[]) {
  if (existsSync(path.resolve(__dirname, '../temp/packages'))) {
    await fs.rm(path.resolve(__dirname, '../temp/packages'), {
      recursive: true
    })
  }

  let errs = ''
  let start = performance.now()
  let count = 0

  for (const file of await glob('packages/*/src/**/*.ts')) {
    if (isIgnore(file)) {
      continue
    }

    const ts = await fs.readFile(file, 'utf-8')
    const dts = isolatedDeclaration(file, ts, {
      sourcemap: false,
      stripInternal: true
    })
    if (dts.errors.length) {
      dts.errors.forEach(err => {
        // temporary workaround for https://github.com/oxc-project/oxc/issues/5668
        if (!err.message.includes('set value(_: S)')) {
          console.error(err)
        }
        errs += err.message + '\n'
      })
    }

    const filepath = /\.d\.ts$/.test(file)
      ? file
      : file.replace(/\.ts$/, '.d.ts')
    await write(path.join('temp', filepath), dts.code)
    count++
  }

  console.log(
    `\n${count} isolated dts files generated in ${(performance.now() - start).toFixed(2)}ms.`
  )

  if (errs) {
    await write(path.join('temp', 'oxc-iso-decl-errors.txt'), errs)
  }

  console.log('bundling dts ...')

  // bundle with rollup-plugin-dts
  const rollupConfigs = await createDtsConfig(targets)

  start = performance.now()

  const all: Promise<string>[] = []
  for (const [dtsPath, config] of Object.entries(rollupConfigs)) {
    const s = rollup(config).then(bundle => {
      if (config.output == null) {
        throw new Error('output is required')
      }
      if (Array.isArray(config.output)) {
        throw new Error('output must be an object')
      }
      const output = config.output
      return bundle.write(output).then(() => {
        console.log(pc.gray('built: ') + pc.blue(dtsPath))
        return dtsPath
      })
    })
    all.push(s)
  }
  await Promise.all(all)

  console.log(
    `${all.length} bundled dts generated in ${(performance.now() - start).toFixed(2)}ms.`
  )
}

async function write(file: string, content: string) {
  const dir = path.dirname(file)
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true })
  }
  await fs.writeFile(file, content)
}
