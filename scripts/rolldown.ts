import polyfillNode from '@rolldown/plugin-node-polyfills'
import { minify as minifySwc } from '@swc/core'
import { promises as fs } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'
import { entries } from './aliases'
// @ts-expect-error -- experimental
import { replacePlugin } from 'rolldown/experimental'

import type { OutputOptions, Plugin, RolldownOptions } from 'rolldown'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const masterVersion = require('../package.json').version
const packagesDir = path.resolve(__dirname, '../packages')

export function createConfigsForPackage({
  target,
  commit,
  formats,
  devOnly = false,
  prodOnly = false,
  sourceMap = false
  // localDev = false,
  // inlineDeps = false
}: {
  target: string
  commit: string
  formats?: string[]
  devOnly?: boolean
  prodOnly?: boolean
  sourceMap?: boolean
  localDev?: boolean
  inlineDeps?: boolean
}) {
  const packageDir = path.resolve(packagesDir, target)
  const resolve = (p: string) => path.resolve(packageDir, p)
  const pkg = require(resolve(`package.json`))
  const packageOptions = (pkg.buildOptions || {}) as {
    name: string
    formats?: string[]
    prod?: boolean
    enableNonBrowserBranches?: boolean
  }
  const name = path.basename(packageDir)

  const banner = `/*!
* ${pkg.name} v${pkg.version}
* (c) 2016-present ${pkg.author.name} and contributors
* Released under the ${pkg.license} License.
*/`

  function resolveStubs(name: string, ns = '') {
    return {
      [`dist/${ns}${name}.cjs`]: `${ns}${name}.cjs.js`,
      [`dist/${ns}${name}.mjs`]: `${ns}${name}.esm-bundler.js`,
      [`dist/${ns}${name}.runtime.mjs`]: `${ns}${name}.runtime.esm-bundler.js`,
      [`dist/${ns}${name}.prod.cjs`]: `${ns}${name}.cjs.prod.js`
    }
  }

  function resolveOutputConfigs(
    name: string,
    ns = ''
  ): Record<string, OutputOptions> {
    return {
      mjs: {
        file: resolve(`dist/${ns}${name}.mjs`),
        format: `es`
      },
      'mjs-node': {
        file: resolve(`dist/${ns}${name}.node.mjs`),
        format: `es`
      },
      browser: {
        file: resolve(`dist/${ns}${name}.esm-browser.js`),
        format: `es`
      },
      cjs: {
        file: resolve(`dist/${ns}${name}.cjs`),
        format: `cjs`
      },
      global: {
        file: resolve(`dist/${ns}${name}.global.js`),
        format: `iife`
      },
      // runtime-only builds, for '@intlify/core' and 'vue-i18n' package only
      'mjs-runtime': {
        file: resolve(`dist/${ns}${name}.runtime.mjs`),
        format: `es`
      },
      'mjs-node-runtime': {
        file: resolve(`dist/${ns}${name}.runtime.node.mjs`),
        format: `es`
      },
      'browser-runtime': {
        file: resolve(`dist/${ns}${name}.runtime.esm-browser.js`),
        format: 'es'
      },
      'global-runtime': {
        file: resolve(`dist/${ns}${name}.runtime.global.js`),
        format: 'iife'
      }
    }
  }

  let stubs = resolveStubs(name)
  if (name === 'vue-i18n-core') {
    stubs = Object.assign({}, stubs, resolveStubs(name, 'petite-'))
  }

  const outputConfigs = resolveOutputConfigs(name)

  const resolvedFormats = (
    formats ||
    packageOptions.formats || ['esm-bundler', 'cjs']
  )
    .filter(Boolean)
    .filter((format: string) => outputConfigs[format])

  let packageConfigs = prodOnly
    ? []
    : resolvedFormats.map((format: string) =>
        createConfig(format, outputConfigs[format])
      )

  const petiteOutputConfigs =
    name === 'vue-i18n-core' ? resolveOutputConfigs(name, 'petite-') : {}

  if (name === 'vue-i18n-core') {
    packageConfigs = [
      ...packageConfigs,
      ...resolvedFormats.map(format =>
        createConfig(format, petiteOutputConfigs[format])
      )
    ]
  }

  if (!devOnly) {
    resolvedFormats.forEach((format: string) => {
      if (packageOptions.prod === false) {
        return
      }
      if (format === 'cjs') {
        packageConfigs.push(createProductionConfig(format, name))
        if (name === 'vue-i18n-core') {
          packageConfigs.push(createProductionConfig(format, name, 'petite-'))
        }
      }
      if (/^(global|browser)(-runtime)?/.test(format)) {
        packageConfigs.push(createMinifiedConfig(format, outputConfigs[format]))
        if (name === 'vue-i18n-core') {
          packageConfigs.push(
            createMinifiedConfig(format, petiteOutputConfigs[format])
          )
        }
      }
    })
  }

  function createConfig(
    format: string,
    output: OutputOptions,
    plugins: Plugin[] = []
  ): RolldownOptions {
    if (!output) {
      console.log(pc.yellow(`invalid format: "${format}"`))
      process.exit(1)
    }
    const rawFile = output.file

    const isProductionBuild =
      process.env.__DEV__ === 'false' ||
      /\.prod\.[cm]?js$/.test(String(output.file) || '')
    const isBundlerESMBuild = /mjs/.test(format)
    const isBrowserESMBuild =
      /browser/.test(format) && !packageOptions.enableNonBrowserBranches
    // const isCJSBuild = format === 'cjs'
    const isNodeBuild =
      String(output.file).includes('.node.') || format === 'cjs'
    const isGlobalBuild = /global/.test(format)
    const isRuntimeOnlyBuild = /runtime/.test(format)
    const isLite = /petite-vue-i18n/.test(String(output.file))

    // output.dir = resolve('dist')
    output.sourcemap = sourceMap
    output.banner = banner
    output.externalLiveBindings = false
    // if (isCJSBuild) {
    //   output.esModule = true
    // }
    if (
      name === 'vue-i18n' ||
      name === 'vue-i18n-core' ||
      name === 'petite-vue-i18n'
    ) {
      output.globals = {
        vue: 'Vue',
        '@vue/devtools-api': 'VueDevtoolsApi'
      }
    }
    if (isGlobalBuild) {
      output.name = packageOptions.name
    }

    const entryFile =
      name !== 'vue-i18n-core'
        ? /runtime/.test(format)
          ? `src/runtime.ts`
          : `src/index.ts`
        : !/petite-vue-i18n/.test(String(output.file))
          ? `src/index.ts`
          : `src/petite.ts`

    function resolveDefine() {
      const defines: Record<string, string> = {
        __COMMIT__: `"${commit}"`,
        __VERSION__: `'${masterVersion}'`,
        // this is only used during Vue's internal tests
        __TEST__: `false`,
        // If the build is expected to run directly in the browser (global / esm builds)
        __BROWSER__: String(isBrowserESMBuild),
        __GLOBAL__: String(isGlobalBuild),
        // for runtime only
        __RUNTIME__: String(isRuntimeOnlyBuild),
        // bundle filename
        // __BUNDLE_FILENAME__: `'${path.parse(String(output.file || '')).base || ''}'`,
        __ESM_BUNDLER__: String(isBundlerESMBuild),
        __ESM_BROWSER__: String(isBrowserESMBuild),
        // is targeting Node (SSR)?
        __NODE_JS__: String(isNodeBuild),
        // for lite version
        __LITE__: String(isLite),
        // feature flags
        __FEATURE_FULL_INSTALL__: isBundlerESMBuild
          ? `__VUE_I18N_FULL_INSTALL__`
          : `true`,
        __FEATURE_LEGACY_API__: isBundlerESMBuild
          ? `__VUE_I18N_LEGACY_API__`
          : `true`,
        __FEATURE_PROD_VUE_DEVTOOLS__:
          ['vue-i18n', 'petite-vue-i18n'].includes(name) && isNodeBuild
            ? 'false' // tree-shake devtools
            : isBundlerESMBuild
              ? `__VUE_PROD_DEVTOOLS__`
              : `false`,
        __FEATURE_PROD_INTLIFY_DEVTOOLS__: isBundlerESMBuild
          ? `__INTLIFY_PROD_DEVTOOLS__`
          : `false`,
        __FEATURE_DROP_MESSAGE_COMPILER__: isBundlerESMBuild
          ? `__INTLIFY_DROP_MESSAGE_COMPILER__`
          : `false`
      }

      if (!isBundlerESMBuild) {
        // hard coded dev/prod builds
        defines.__DEV__ = String(!isProductionBuild)
      }

      // allow inline overrides like
      //__LITE__=true pnpm build core-base
      Object.keys(defines).forEach(key => {
        if (key in process.env) {
          const value = process.env[key]
          assert(typeof value === 'string')
          defines[key] = value
        }
      })

      return defines
    }

    function resolveReplace() {
      const replacements: Record<string, string> = {}

      if (isBundlerESMBuild) {
        Object.assign(replacements, {
          // preserve to be handled by bundlers
          __DEV__:
            ['vue-i18n', 'petite-vue-i18n'].includes(name) && isNodeBuild
              ? 'false' // tree-shake devtools
              : isBundlerESMBuild
                ? // preserve to be handled by bundlers
                  `(process.env.NODE_ENV !== 'production')`
                : // hard coded dev/prod builds
                  !isProductionBuild
        })
      }

      if (isProductionBuild && isBrowserESMBuild) {
        Object.assign(replacements, {
          'emitError(': `/*#__PURE__*/ emitError(`,
          'createCompileError(': `/*#__PURE__*/ createCompileError(`,
          'throw createCoreError(': `throw Error(`,
          'throw createI18nError(': `throw Error(`
        })
      }

      if (Object.keys(replacements).length) {
        return [replacePlugin(replacements)]
      } else {
        return []
      }
    }

    function resolveExternal() {
      return isGlobalBuild || isBrowserESMBuild
        ? ['vue'] // packageOptions.enableNonBrowserBranches
        : // ? packageOptions.enableFullBundleForEsmBrowser && isBrowserESMBuild
          //   ? []
          //   : ['vue'] // packageOptions.enableNonBrowserBranches
          // Node / esm-bundler builds. Externalize everything.
          [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {})
          ]
    }

    function resolveNodePlugins() {
      const nodePlugins =
        (format === 'cjs' && Object.keys(pkg.devDependencies || {}).length) ||
        packageOptions.enableNonBrowserBranches
          ? [...(format === 'cjs' ? [] : [polyfillNode()])]
          : []
      return nodePlugins
    }

    return {
      input: resolve(entryFile),
      // Global and Browser ESM builds inlines everything so that they can be
      // used alone.
      external: resolveExternal(),
      define: resolveDefine(),
      platform: format === 'cjs' ? 'node' : 'browser',
      resolve: {
        alias: entries
      },
      plugins: [
        ...resolveReplace(),
        ...resolveNodePlugins(),
        ...plugins,
        {
          name: 'write-stub',
          async writeBundle() {
            if (rawFile == null) {
              return
            }
            const stub = stubs[rawFile]
            if (!stub) {
              return
            }

            const filename = path.basename(rawFile)
            const contents =
              format === 'cjs'
                ? `module.exports = require('./${filename}')`
                : `export * from './${filename}'`

            await fs.writeFile(stub, contents)
            // console.log(`created stub ${pc.bold(path.join('packages', target, 'dist', path.basename(stub)))}`)
          }
        }
      ],
      output,
      treeshake: {
        // https://github.com/rolldown/rolldown/issues/1917
        moduleSideEffects: false
      }
    }
  }

  function createProductionConfig(
    format: string,
    name: string,
    ns = ''
  ): RolldownOptions {
    const extension = format === 'cjs' || format === 'mjs' ? format : 'js'
    const descriptor = format === 'cjs' || format === 'mjs' ? '' : `.${format}`
    return createConfig(format, {
      file: resolve(`dist/${ns}${name}${descriptor}.prod.${extension}`),
      format: outputConfigs[format].format
    })
  }

  function createMinifiedConfig(
    format: string,
    output: OutputOptions
  ): RolldownOptions {
    const newOutput = {
      file: String(output.file).replace(/\.js$/, '.prod.js'),
      format: output.format
    }
    return createConfig(format, newOutput, [
      {
        name: 'swc-minify',
        async renderChunk(contents, _, { format }) {
          const { code } = await minifySwc(contents, {
            module: format === 'es',
            format: {
              comments: false
            },
            compress: {
              ecma: 2016,
              pure_getters: true
            },
            safari10: true,
            mangle: true
          })
          // swc removes banner
          return { code: banner + code, map: null }
        }
      }
    ])
  }

  return packageConfigs
}
