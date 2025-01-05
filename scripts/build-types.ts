import { globSync } from 'fast-glob'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isolatedDeclaration } from 'oxc-transform'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

if (existsSync(path.resolve(__dirname, '../temp/packages'))) {
  rmSync(path.resolve(__dirname, '../temp/packages'), { recursive: true })
}

let errs = ''
let start = performance.now()
let count = 0

const IGNORES = [
  'format-explorer',
  'size-check-core',
  'size-check-vue-i18n',
  'size-check-vue-i18n'
]

for (const file of globSync(
  path.resolve(__dirname, '../packages/*/src/**/*.ts')
)) {
  for (const ignore of IGNORES) {
    if (file.includes(ignore)) {
      continue
    }
  }

  const ts = readFileSync(file, 'utf-8')
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

  write(path.join('temp', file.replace(/\.ts$/, '.d.ts')), dts.code)
  count++
}

console.log(
  `\n${count} isolated dts files generated in ${(performance.now() - start).toFixed(2)}ms.`
)

if (errs) {
  write(path.join('temp', 'oxc-iso-decl-errors.txt'), errs)
}

console.log('bundling dts with rollup-plugin-dts...')

// bundle with rollup-plugin-dts
// const rollupConfigs = (await import('../rollup.dts.config.js')).default

start = performance.now()

// await Promise.all(
//   rollupConfigs.map(c =>
//     rollup(c).then(bundle => {
//       return bundle.write(c.output).then(() => {
//         console.log(pc.gray('built: ') + pc.blue(c.output.file))
//       })
//     }),
//   ),
// )

console.log(
  `bundled dts generated in ${(performance.now() - start).toFixed(2)}ms.`
)

function write(file: string, content: string) {
  const dir = path.dirname(file)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  writeFileSync(file, content)
}
