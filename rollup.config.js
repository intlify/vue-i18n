import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

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

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`
  },
  // runtime-only builds, for '@intlify/core' and 'vue-i18n' package only
  'esm-bundler-runtime': {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`
  },
  'esm-browser-runtime': {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: 'es'
  },
  'global-runtime': {
    file: resolve(`dist/${name}.runtime.global.js`),
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
    if (/^(global|esm-browser)(-runtime)?/.test(format)) {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
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
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isBundlerESMBuild = /esm-bundler/.test(format)
  const isBrowserESMBuild = /esm-browser/.test(format)
  const isNodeBuild = format === 'cjs' || format === 'cjs-lite'
  const isGlobalBuild = /global/.test(format)
  const isRuntimeOnlyBuild = /runtime/.test(format)
  const isLite = /petite-vue-i18n/.test(name)
  const isBridge = /vue-i18n-bridge/.test(name)

  if (isGlobalBuild) {
    output.name = packageOptions.name
    if (isBridge) {
      output.globals = { '@vue/composition-api': 'VueCompositionAPI' }
    }
  }

  const shouldEmitDeclarations = process.env.TYPES != null && !hasTSChecked

  const tsPlugin = ts({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations
      },
      exclude: ['**/test', 'test-dts']
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
    external.push('@vue/composition-api')
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
      path.resolve(__dirname, './packages/vue-i18n-core/src/composer.ts'),
      path.resolve(__dirname, './packages/vue-i18n-core/src/i18n.ts'),
      path.resolve(__dirname, './packages/vue-i18n-core/src/mixins/next.ts'),
      path.resolve(
        __dirname,
        './packages/vue-i18n-core/src/components/NumberFormat.ts'
      ),
      path.resolve(
        __dirname,
        './packages/vue-i18n-core/src/components/DatetimeFormat.ts'
      ),
      path.resolve(
        __dirname,
        './packages/vue-i18n-core/src/components/formatRenderer.ts'
      ),
      path.resolve(
        __dirname,
        './packages/vue-i18n-core/src/components/Translation.ts'
      )
    ]
    plugins.push({
      transform(source, id) {
        if (replacingPaths.some(p => p === id)) {
          return source.replace(`from 'vue'`, `from '@vue/composition-api'`)
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
      ...plugins
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
    __TEST__: false,
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: isBrowserBuild,
    __GLOBAL__: isGlobalBuild,
    // for runtime only
    __RUNTIME__: isRuntimeOnlyBuild,
    // bundle filename
    __BUNDLE_FILENAME__: `'${bundleFilename}'`,
    __ESM_BUNDLER__: isBundlerESMBuild,
    __ESM_BROWSER__: isBrowserESMBuild,
    // is targeting Node (SSR)?
    __NODE_JS__: isNodeBuild,
    // for lite version
    __LITE__: isLite,
    // for bridge version
    __BRIDGE__: isBridge,
    // feature flags
    __FEATURE_FULL_INSTALL__: isBundlerESMBuild
      ? `__VUE_I18N_FULL_INSTALL__`
      : true,
    __FEATURE_LEGACY_API__: isBundlerESMBuild
      ? `__VUE_I18N_LEGACY_API__`
      : true,
    __FEATURE_PROD_VUE_DEVTOOLS__: isBundlerESMBuild
      ? `__VUE_PROD_DEVTOOLS__`
      : false,
    __FEATURE_PROD_INTLIFY_DEVTOOLS__: isBundlerESMBuild
      ? `__INTLIFY_PROD_DEVTOOLS__`
      : false,
    preventAssignment: false,
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
  return replace(replacements)
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: resolve(`dist/${name}.${format}.prod.js`),
    format: outputConfigs[format].format
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
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
          ecma: 2015,
          pure_getters: true
        }
      })
    ]
  )
}
