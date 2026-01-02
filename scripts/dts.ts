import MagicString from 'magic-string'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { dts as rolldownDts } from 'rolldown-plugin-dts'

import type { RolldownOptions, Plugin } from 'rolldown'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = path.resolve(__dirname, '../packages')

function resolveExternal(packageName: string) {
  const pkg = require(`${packagesDir}/${packageName}/package.json`)
  return [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    // NOTE(kazupon): crrently, rolldown-plugin-dts cannot handle subpath imports correctly (e.g. 'pkg/subpath')
    ...(packageName === 'petite-vue-i18n' ? ['@intlify/vue-i18n-core/petite'] : [])
  ]
}

export async function createDtsConfig(targets: string[]): Promise<Record<string, RolldownOptions>> {
  if (!existsSync(path.resolve(__dirname, '../temp/packages'))) {
    console.warn('no temp dts files found. run `pnpm build:rolldown` first')
    process.exit(1)
  }

  const packages = await fs.readdir(path.resolve(__dirname, '../temp/packages'))
  const targetPackages = targets ? packages.filter(pkg => targets.includes(pkg)) : packages

  return targetPackages.reduce(
    (acc, pkg) => {
      const key = `packages/${pkg}/dist/${pkg}.d.ts`
      acc[key] = {
        input: path.resolve(__dirname, `../temp/packages/${pkg}/src/index.d.ts`),
        output: {
          file: path.resolve(__dirname, `../packages/${pkg}/dist/${pkg}.d.ts`),
          format: 'es'
        },
        external: resolveExternal(pkg),
        plugins: [
          rolldownDts(),
          ...(pkg === 'vue-i18n' || pkg === 'petite-vue-i18n' ? [appendTypes(pkg)] : []),
          ...(pkg === 'vue-i18n-core' ? [copyDts()] : [])
        ],
        onwarn(warning, warn) {
          if (warning.code === 'UNRESOLVED_IMPORT' && !warning.exporter?.startsWith('.')) {
            return
          }
          if (warning.code === 'PLUGIN_TIMINGS') {
            return
          }
          warn(warning)
        }
      }
      return acc
    },
    Object.create(null) as Record<string, RolldownOptions>
  )
}

function appendTypes(pkg: string): Plugin {
  return {
    name: 'append-types',
    async renderChunk(code) {
      const template = path.resolve(__dirname, `../packages/${pkg}/src/vue.d.ts`)
      const s = new MagicString(code)
      const ts = await fs.readFile(template, 'utf-8')
      const marker =
        '// --- THE CONTENT BELOW THIS LINE WILL BE APPENDED TO DTS FILE IN DIST DIRECTORY --- //'
      const data = ts.slice(ts.indexOf(marker) + marker.length)
      s.append(`\n` + data + `\n` + `export { }`)
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
