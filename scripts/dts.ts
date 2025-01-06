import MagicString from 'magic-string'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dts from 'rollup-plugin-dts'

import type { Plugin, RollupOptions } from 'rollup'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createDtsConfig(targets: string[]) {
  if (!existsSync(path.resolve(__dirname, '../temp/packages'))) {
    console.warn('no temp dts files found. run `pnpm build:rolldown` first')
    process.exit(1)
  }

  const packages = await fs.readdir(path.resolve(__dirname, '../temp/packages'))
  const targetPackages = targets
    ? packages.filter(pkg => targets.includes(pkg))
    : packages

  return targetPackages.reduce(
    (acc, pkg) => {
      const key = `packages/${pkg}/dist/${pkg}.d.ts`
      acc[key] = {
        input: path.resolve(
          __dirname,
          `../temp/packages/${pkg}/src/index.d.ts`
        ),
        output: {
          file: path.resolve(__dirname, `../packages/${pkg}/dist/${pkg}.d.ts`),
          format: 'es'
        },
        plugins: [
          dts(),
          ...(pkg === 'vue-i18n' || pkg === 'petite-vue-i18n'
            ? [appendTypes(pkg)]
            : []),
          ...(pkg === 'vue-i18n-core' ? [copyDts()] : [])
        ],
        onwarn(warning, warn) {
          if (
            warning.code === 'UNRESOLVED_IMPORT' &&
            !warning.exporter?.startsWith('.')
          ) {
            return
          }
          warn(warning)
        }
      }
      return acc
    },
    {} as Record<string, RollupOptions>
  )
}

function appendTypes(pkg: string): Plugin {
  return {
    name: 'append-types',
    async renderChunk(code) {
      const template = path.resolve(
        __dirname,
        `../packages/${pkg}/src/vue.d.ts`
      )
      const s = new MagicString(code)
      const ts = await fs.readFile(template, 'utf-8')
      s.prepend(ts + `\n`)
      return s.toString()
    }
  }
}

function copyDts(): Plugin {
  return {
    name: 'copy-dts',
    async writeBundle(_, output) {
      const s = output['vue-i18n-core.d.ts'] as { code: string }
      const petiteDts = path.resolve(
        __dirname,
        `../packages/vue-i18n-core/dist/petite-vue-i18n-core.d.ts`
      )
      await fs.writeFile(petiteDts, s.code, 'utf8')
    }
  }
}
