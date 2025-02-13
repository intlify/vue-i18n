import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { promises as fs } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'
import ts from 'rollup-plugin-typescript2'

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
  * (c) 2016-present ${pkg.author.name} and contributors
  * Released under the ${pkg.license} License.
  */`

// ensure TS checks only once for each build
let hasTSChecked = false

function resolveStubs(name, ns = '') {
  return {
    [`dist/${ns}${name}.cjs`]: `${ns}${name}.cjs.js`,
    [`dist/${ns}${name}.mjs`]: `${ns}${name}.esm-bundler.js`,
    [`dist/${ns}${name}.runtime.mjs`]: `${ns}${name}.runtime.esm-bundler.js`,
    [`dist/${ns}${name}.prod.cjs`]: `${ns}${name}.cjs.prod.js`
  }
}

function resolveOutputConfigs(name, ns = '') {
  return {
    mjs: {
      file: `dist/${ns}${name}.mjs`,
      format: `es`
    },
    'mjs-node': {
      file: `dist/${ns}${name}.node.mjs`,
      format: `es`
    },
    browser: {
      file: `dist/${ns}${name}.esm-browser.js`,
      format: `es`
    },
    cjs: {
      file: `dist/${ns}${name}.cjs`,
      format: `cjs`
    },
    global: {
      file: `dist/${ns}${name}.global.js`,
      format: `iife`
    },
    // runtime-only builds, for '@intlify/core' and 'vue-i18n' package only
    'mjs-runtime': {
      file: `dist/${ns}${name}.runtime.mjs`,
      format: `es`
    },
    'mjs-node-runtime': {
      file: `dist/${ns}${name}.runtime.node.mjs`,
      format: `es`
    },
    'browser-runtime': {
      file: `dist/${ns}${name}.runtime.esm-browser.js`,
      format: 'es'
    },
    'global-runtime': {
      file: `dist/${ns}${name}.runtime.global.js`,
      format: 'iife'
    }
  }
}

const outputConfigs = resolveOutputConfigs(name)
const defaultFormats = ['esm-bundler', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || packageOptions.formats || defaultFormats

let packageConfigs = process.env.PROD_ONLY
  ? []
  : packageFormats.map(format => createConfig(format, outputConfigs[format]))

const petiteOutputConfigs =
  name === 'vue-i18n-core' ? resolveOutputConfigs(name, 'petite-') : {}

if (name === 'vue-i18n-core') {
  packageConfigs = [
    ...packageConfigs,
    ...packageFormats.map(format =>
      createConfig(format, petiteOutputConfigs[format])
    )
  ]
}

let stubs = resolveStubs(name)
stubs = Object.assign({}, stubs, resolveStubs(name, 'petite-'))

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach(format => {
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
  const isNodeBuild = output.file.includes('.node.') || format === 'cjs'
  const isGlobalBuild = /global/.test(format)
  const isRuntimeOnlyBuild = /runtime/.test(format)
  const isLite = /petite-vue-i18n/.test(output.file)

  if (isGlobalBuild) {
    output.name = packageOptions.name
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
      exclude: ['**/test', 'e2e', 'scripts', '*.config.ts']
    }
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  const entryFile =
    name !== 'vue-i18n-core'
      ? /runtime/.test(format)
        ? `src/runtime.ts`
        : `src/index.ts`
      : !/petite-vue-i18n/.test(output.file)
        ? `src/index.ts`
        : `src/petite.ts`

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
        name,
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

          /*
          // add the node specific version
          if (format === 'mjs' || format === 'mjs-runtime') {
            // NOTE:
            //  https://github.com/vuejs/router/issues/1516
            //  https://github.com/vuejs/router/commit/53f720622aa273e33c05517fa917cdcfbfba52bc
            if (name === 'vue-i18n' || name === 'petite-vue-i18n') {
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
          */
        }
      }
    ],
    output,
    onwarn: (msg, warn) => {
      if (
        !(
          msg.code == 'CIRCULAR_DEPENDENCY' ||
          msg.code == 'EMPTY_BUNDLE' ||
          msg.code == 'UNRESOLVED_IMPORT'
        )
      ) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}

function createReplacePlugin(
  name,
  isProduction,
  isBundlerESMBuild,
  isBrowserESMBuild,
  isBrowserBuild,
  isGlobalBuild,
  isNodeBuild,
  isRuntimeOnlyBuild,
  isLite,
  bundleFilename
) {
  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `'${masterVersion}'`,
    __DEV__:
      ['vue-i18n', 'petite-vue-i18n'].includes(name) && isNodeBuild
        ? 'false' // tree-shake devtools
        : isBundlerESMBuild
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
    // feature flags
    __FEATURE_FULL_INSTALL__: isBundlerESMBuild
      ? `__VUE_I18N_FULL_INSTALL__`
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
      : `false`,
    ...(isProduction && isBrowserBuild
      ? {
          'emitError(': `/*#__PURE__*/ emitError(`,
          'createCompileError(': `/*#__PURE__*/ createCompileError(`,
          'throw createCoreError(': `throw Error(`,
          'throw createI18nError(': `throw Error(`
        }
      : {})
  }
  Object.keys(replacements).forEach(key => {
    if (key in process.env) {
      replacements[key] = process.env[key]
    }
  })
  return replace({
    values: replacements,
    preventAssignment: true,
    /**
     * we need this delimiter to prevent adding PURE comments at function declarations
     * https://rollupjs.org/configuration-options/#pure
     */
    delimiters: ['\\b(?<!function )', '']
  })
}

function createProductionConfig(format, name, ns = '') {
  const extension = format === 'cjs' || format === 'mjs' ? format : 'js'
  const descriptor = format === 'cjs' || format === 'mjs' ? '' : `.${format}`
  return createConfig(format, {
    file: `dist/${ns}${name}${descriptor}.prod.${extension}`,
    format: outputConfigs[format].format
  })
}

function createMinifiedConfig(format, output) {
  const newOutput = {
    file: output.file.replace(/\.js$/, '.prod.js'),
    format: output.format
  }
  return createConfig(format, newOutput, [
    terser({
      module: /^esm/.test(format),
      compress: {
        ecma: 2015
      },
      safari10: true
    })
  ])
}
