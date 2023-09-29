import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import pc from 'picocolors'

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const masterVersion = require('./package.json').version
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const name = path.basename(packageDir)
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}

const banner = `/*!
  * ${name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author.name}
  * Released under the ${pkg.license} License.
  */`

// ensure TS checks only once for each build
let hasTSChecked = false

const stubs = {
  [`dist/${name}.cjs`]: `${name}.cjs.js`,
  [`dist/${name}.mjs`]: `${name}.esm-bundler.js`,
  [`dist/${name}.runtime.mjs`]: `${name}.runtime.esm-bundler.js`,
  [`dist/${name}.prod.cjs`]: `${name}.cjs.prod.js`
}

const outputConfigs = {
  mjs: {
    file: `dist/${name}.mjs`,
    format: `es`
  },
  'mjs-node': {
    file: `dist/${name}.node.mjs`,
    format: `es`
  },
  browser: {
    file: `dist/${name}.esm-browser.js`,
    format: `es`
  },
  /*
  'esm-bundler': {
    file: `dist/${name}.esm-bundler.mjs`,
    format: `es`
  },
  'esm-browser': {
    file: `dist/${name}.esm-browser.mjs`,
    format: `es`
  },
  */
  cjs: {
    // file: `dist/${name}.cjs.js`,
    file: `dist/${name}.cjs`,
    format: `cjs`
  },
  global: {
    file: `dist/${name}.global.js`,
    format: `iife`
  },
  // runtime-only builds, for '@intlify/core' and 'vue-i18n' package only
  'mjs-runtime': {
    file: `dist/${name}.runtime.mjs`,
    format: `es`
  },
  'browser-runtime': {
    file: `dist/${name}.runtime.esm-browser.js`,
    format: 'es'
  },
  /*
  'esm-bundler-runtime': {
    file: `dist/${name}.runtime.esm-bundler.mjs`,
    format: `es`
  },
  'esm-browser-runtime': {
    file: `dist/${name}.runtime.esm-browser.mjs`,
    format: 'es'
  },
  */
  'global-runtime': {
    file: `dist/${name}.runtime.global.js`,
    format: 'iife'
  }
}

const defaultFormats = ['esm-bundler', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]))

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
    if (packageOptions.prod === false) {
      return
    }
    if (format === 'cjs') {
      packageConfigs.push(createProductionConfig(format))
    }
    if (/^(global|browser)(-runtime)?/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

export default packageConfigs

function createConfig(format, _output, plugins = []) {
  const rawFile = _output.file
  const output = { format: _output.format, file: resolve(rawFile) }

  if (!output) {
    console.log(pc.yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.banner = banner
  output.externalLiveBindings = false
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

  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.[cm]?js$/.test(output.file)
  const isBundlerESMBuild = /mjs/.test(format)
  const isBrowserESMBuild = /browser/.test(format)
  // const isNodeBuild = format === 'cjs' || format === 'cjs-lite'
  const isNodeBuild =
    output.file.includes('.node.') || format === 'cjs' || format === 'cjs-lite'
  const isGlobalBuild = /global/.test(format)
  const isRuntimeOnlyBuild = /runtime/.test(format)
  const isLite = /petite-vue-i18n/.test(name)
  const isBridge = /vue-i18n-bridge/.test(name)

  if (isGlobalBuild) {
    output.name = packageOptions.name
    if (isBridge) {
      output.globals = { 'vue-demi': 'VueDemi' }
    }
  }

  const shouldEmitDeclarations = process.env.TYPES != null && !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        // target: isNodeBuild ? 'es2019' : 'es2015',
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['**/test', 'test-dts', 'e2e', 'scripts']
    }
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const entryFile = /runtime/.test(format) ? `src/runtime.ts` : `src/index.ts`

  const external =
    isGlobalBuild || isBrowserESMBuild
      ? ['vue'] // packageOptions.enableNonBrowserBranches
      : // ? packageOptions.enableFullBundleForEsmBrowser && isBrowserESMBuild
        //   ? []
        //   : ['vue'] // packageOptions.enableNonBrowserBranches
        // Node / esm-bundler builds. Externalize everything.
        [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {})
        ]
  if (isBridge) {
    external.push('vue-demi')
  }

  const nodePlugins =
    // packageOptions.enableNonBrowserBranches && format !== 'cjs'
    format !== 'cjs'
      ? [
          require('@rollup/plugin-node-resolve').nodeResolve(),
          require('@rollup/plugin-commonjs')({
            sourceMap: false
          }),
          require('rollup-plugin-node-builtins')(),
          require('rollup-plugin-node-globals')()
        ]
      : []

  if (isBridge) {
    const replacingPaths = [
      './packages/vue-i18n-core/src/composer.ts',
      './packages/vue-i18n-core/src/utils.ts',
      './packages/vue-i18n-core/src/i18n.ts',
      './packages/vue-i18n-core/src/mixins/next.ts',
      './packages/vue-i18n-core/src/components/NumberFormat.ts',
      './packages/vue-i18n-core/src/components/DatetimeFormat.ts',
      './packages/vue-i18n-core/src/components/formatRenderer.ts',
      './packages/vue-i18n-core/src/components/Translation.ts',
      './packages/vue-i18n-core/src/components/utils.ts'
    ].map(sourcePath => path.resolve(__dirname, sourcePath))
    plugins.push({
      transform(source, id) {
        if (replacingPaths.some(p => p === id)) {
          return source.replace(`from 'vue'`, `from 'vue-demi'`)
        }
        return source
      }
    })
  }

  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      json({
        namedExports: false
      }),
      tsPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        isBrowserESMBuild,
        // isBrowserBuild?
        isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild,
        // (isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild) && !packageOptions.enableFullBundleForEsmBrowser,
        isGlobalBuild,
        isNodeBuild,
        isRuntimeOnlyBuild,
        isLite,
        isBridge,
        path.parse(output.file).base || ''
      ),
      ...nodePlugins,
      ...plugins,
      {
        async writeBundle() {
          const stub = stubs[rawFile]
          if (!stub) return

          const contents =
            format === 'cjs'
              ? `module.exports = require('../${rawFile}')`
              : `export * from '../${rawFile}'`

          await fs.writeFile(resolve(`dist/${stub}`), contents)
          console.log(`created stub ${pc.bold(`dist/${stub}`)}`)

          // add the node specific version
          if (format === 'mjs' || format === 'mjs-runtime') {
            // NOTE:
            //  https://github.com/vuejs/router/issues/1516
            //  https://github.com/vuejs/router/commit/53f720622aa273e33c05517fa917cdcfbfba52bc
            if (
              name === 'vue-i18n' ||
              name === 'vue-i18n-bridge' ||
              name === 'petite-vue-i18n'
            ) {
              const outfile = `dist/${stub}`.replace(
                'esm-bundler.js',
                'node.mjs'
              )
              await fs.writeFile(
                resolve(outfile),
                `global.__VUE_PROD_DEVTOOLS__ = false;\n` + contents
              )
              console.log(`created stub ${pc.bold(outfile)}`)
            } else if (name === 'core') {
              const outfile = `dist/${stub}`.replace(
                'esm-bundler.js',
                'node.mjs'
              )
              await fs.writeFile(
                resolve(outfile),
                `global.__VUE_PROD_DEVTOOLS__ = false;\nglobal.__INTLIFY_JIT_COMPILATION__ = true;\n` +
                  contents
              )
              console.log(`created stub ${pc.bold(outfile)}`)
            }
          }
        }
      }
    ],
    output,
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}

function createReplacePlugin(
  isProduction,
  isBundlerESMBuild,
  isBrowserESMBuild,
  isBrowserBuild,
  isGlobalBuild,
  isNodeBuild,
  isRuntimeOnlyBuild,
  isLite,
  isBridge,
  bundleFilename
) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `'${masterVersion}'`,
    __DEV__: isBundlerESMBuild
      ? // preserve to be handled by bundlers
        `(process.env.NODE_ENV !== 'production')`
      : // hard coded dev/prod builds
        !isProduction,
    // this is only used during Vue's internal tests
    __TEST__: `false`,
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: String(isBrowserBuild),
    __GLOBAL__: String(isGlobalBuild),
    // for runtime only
    __RUNTIME__: String(isRuntimeOnlyBuild),
    // bundle filename
    __BUNDLE_FILENAME__: `'${bundleFilename}'`,
    __ESM_BUNDLER__: String(isBundlerESMBuild),
    __ESM_BROWSER__: String(isBrowserESMBuild),
    // is targeting Node (SSR)?
    __NODE_JS__: String(isNodeBuild),
    // for lite version
    __LITE__: String(isLite),
    // for bridge version
    __BRIDGE__: String(isBridge),
    // feature flags
    __FEATURE_FULL_INSTALL__: isBundlerESMBuild
      ? `__VUE_I18N_FULL_INSTALL__`
      : `true`,
    __FEATURE_LEGACY_API__: isBundlerESMBuild
      ? `__VUE_I18N_LEGACY_API__`
      : `true`,
    __FEATURE_PROD_VUE_DEVTOOLS__: isBundlerESMBuild
      ? `__VUE_PROD_DEVTOOLS__`
      : `false`,
    __FEATURE_PROD_INTLIFY_DEVTOOLS__: isBundlerESMBuild
      ? `__INTLIFY_PROD_DEVTOOLS__`
      : `false`,
    __FEATURE_JIT_COMPILATION__: isBundlerESMBuild
      ? `__INTLIFY_JIT_COMPILATION__`
      : `false`,
    __FEATURE_DROP_MESSAGE_COMPILER__: isBundlerESMBuild
      ? `__INTLIFY_DROP_MESSAGE_COMPILER__`
      : `false`,
    ...(isProduction && isBrowserBuild
      ? {
          'emitError(': `/*#__PURE__*/ emitError(`,
          'createCompileError(': `/*#__PURE__*/ createCompileError(`,
          'function createCoreError(': `/*#__PURE__*/ function createCoreError(`,
          'throw createCoreError(': `throw Error(`,
          'function createI18nError(': `/*#__PURE__*/ function createI18nError(`,
          'throw createI18nError(': `throw Error(`
        }
      : {})
  }
  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })
  return replace({ values: replacements, preventAssignment: true })
}

function createProductionConfig(format) {
  // const extension = format === 'cjs' ? 'cjs' : 'js'
  // const descriptor = format === 'cjs' ? '' : `.${format}`
  const extension = format === 'cjs' || format === 'mjs' ? format : 'js'
  const descriptor = format === 'cjs' || format === 'mjs' ? '' : `.${format}`
  return createConfig(format, {
    file: `dist/${name}${descriptor}.prod.${extension}`,
    format: outputConfigs[format].format
  })
}

function createMinifiedConfig(format) {
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015
        },
        safari10: true
      })
    ]
  )
}
