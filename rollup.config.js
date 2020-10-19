import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'

const pkg = require('./package.json')
const { name } = pkg

const banner = `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()} ${pkg.author.name}
  * Released under the ${pkg.license} License.
  */`

// ensure TS checks only once for each build
let hasTSChecked = false

const outputConfigs = {
  // each file name has the format: `dist/${name}.${format}.js`
  // format being a key of this object
  'esm-bundler': {
    file: pkg.module,
    format: 'es'
  },
  'esm-browser': {
    file: pkg.browser,
    format: 'es'
  },
  cjs: {
    file: pkg.main,
    format: 'cjs'
  },
  global: {
    file: pkg.unpkg,
    format: 'iife'
  }
}

const allFormats = Object.keys(outputConfigs)
const packageFormats = allFormats
const packageConfigs = packageFormats.map(format =>
  createConfig(format, outputConfigs[format])
)

// only add the production ready if we are bundling the options
packageFormats.forEach(format => {
  if (format === 'cjs') {
    packageConfigs.push(createProductionConfig(format))
  }
  if (format === 'global' || format === 'esm-browser') {
    packageConfigs.push(createMinifiedConfig(format))
  }
})

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.banner = banner
  output.externalLiveBindings = false

  const isProductionBuild =
    process.env.__DEV__ === 'false' || /\.prod\.js$/.test(output.file)
  const isBundlerESMBuild = /esm-bundler/.test(format)
  const isBrowserESMBuild = /esm-browser/.test(format)
  const isNodeBuild = format === 'cjs'
  const isGlobalBuild = format === 'global'

  if (isGlobalBuild) {
    output.name = 'VueI18n'
  }

  // const shouldEmitDeclarations = process.env.TYPES != null && !hasTSChecked
  const shouldEmitDeclarations = !hasTSChecked

  const tsPlugin = typescript({
    check: process.env.NODE_ENV === 'production' && !hasTSChecked,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
    // verbosity: 4,
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
        declarationDir: path.resolve(__dirname, 'types')
      }
    }
  })

  output.globals = {
    vue: 'Vue'
    // '@vue/devtools-api': 'VueDevtoolsApi'
  }

  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  // const external =
  //   isGlobalBuild || isBrowserESMBuild
  //     ? ['source-map']
  //     : [
  //         ...Object.keys(pkg.dependencies || {}),
  //         ...Object.keys(pkg.peerDependencies || {})
  //       ]
  const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ]

  const nodePlugins =
    format !== 'cjs'
      ? [
          require('@rollup/plugin-node-resolve').nodeResolve({
            preferBuiltins: true
          }),
          require('@rollup/plugin-commonjs')({
            sourceMap: false
          }),
          require('rollup-plugin-node-builtins')(),
          require('rollup-plugin-node-globals')()
        ]
      : []

  // const nodePlugins = [resolve(), commonjs()]

  return {
    input: path.resolve(`src/index.ts`),
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      tsPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        isBrowserESMBuild,
        isGlobalBuild || isBrowserESMBuild || isBundlerESMBuild,
        isGlobalBuild,
        isNodeBuild
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
  isNodeBuild
) {
  const replacements = {
    __VERSION__: `"${pkg.version}"`,
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
    __ESM_BUNDLER__: isBundlerESMBuild,
    __ESM_BROWSER__: isBrowserESMBuild,
    __NODE_JS__: isNodeBuild,
    // feature flags
    __FEATURE_FULL_INSTALL__: isBundlerESMBuild
      ? `__VUE_I18N_FULL_INSTALL__`
      : true,
    __FEATURE_LEGACY_API__: isBundlerESMBuild
      ? `__VUE_I18N_LEGACY_API__`
      : true,
    __FEATURE_PROD_DEVTOOLS__: isBundlerESMBuild
      ? `__INTLIFY_PROD_DEVTOOLS__`
      : false,
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
    file: path.resolve(__dirname, `dist/${name}.${format}.prod.js`),
    format: outputConfigs[format].format
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    format,
    {
      file: path.resolve(__dirname, `dist/${name}.${format}.prod.js`),
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
