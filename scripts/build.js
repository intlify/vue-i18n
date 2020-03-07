const { promisify } = require('util')
const path = require('path')
const fs = require('fs')
const zlib = require('zlib')
const chalk = require('chalk')
const { rollup } = require('rollup')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const replace = require('@rollup/plugin-replace')
const typescript = require('rollup-plugin-typescript2')
const { terser } = require('rollup-plugin-terser')

// require.main cannot be used because this process is run externally (from vue-cli-service)
const { dependencies } = require(path.resolve(process.cwd(), 'package.json'))
const classifyRE = /(?:^|[-_\/])(\w)/g
const toUpper = (_, c) => c ? c.toUpperCase() : ''
const classify = str => str.replace(classifyRE, toUpper)
const getSize = code => (code.length / 1024).toFixed(2) + 'kb'
const banner = ({ name, version, year, author, license }) => {
  return '/*!\n' +
  ` * ${name} v${version} \n` +
  ` * (c) ${year} ${author}\n` +
  ` * Released under the ${license} License.\n` +
  ' */'
}

function loadPackage (context) {
  let pkg = {}
  try {
    pkg = require(path.resolve(context, 'package.json'))
  } catch (e) {
    console.error('loadPackage error', e.message)
  }
  return pkg
}

function write (dest, code, zip) {
  const writeFile = promisify(fs.writeFile)
  const gzip = promisify(zlib.gzip)
  return new Promise(async (resolve, reject) => {
    const report = extra => {
      console.log(`📦  ${chalk.blue.bold(path.relative(process.cwd(), dest))} ${getSize(code) + (extra || '')}`)
    }
    try {
      await writeFile(dest, code)
      if (zip) {
        const zipped = await gzip(code)
        report(` (gzipped: ${getSize(zipped)})`)
      } else {
        report()
      }
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

function makeEntries (entryPath, destPath, moduleName, packageName, banner) {
  const resolve = _path => path.resolve(destPath, _path)
  return {
    cjs: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.cjs.js`),
      format: 'cjs',
      banner
    },
    esmBundler: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.esm.bundler.js`),
      format: 'es',
      banner
    },
    iifeProduction: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.iife.min.js`),
      format: 'iife',
      env: 'production',
      moduleName,
      banner
    },
    iifeDevelopment: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.iife.js`),
      format: 'iife',
      env: 'development',
      moduleName,
      banner
    },
    esmDevelopment: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.esm.js`),
      format: 'es',
      env: 'development',
      moduleName,
      banner
    },
    esmProduction: {
      entry: resolve(entryPath),
      dest: resolve(`dist/${packageName}.esm.min.js`),
      format: 'es',
      env: 'production',
      moduleName,
      banner
    }
  }
}

function setupPlugins (target, version, env, format, plugins = []) {
  plugins.push(nodeResolve(), commonjs())
  plugins.push(
    typescript({
      tsconfig: path.resolve(target, 'tsconfig.json'),
      cacheRoot: path.resolve(target, 'node_modules/.rts2_cache'),
      clean: true
    })
  )

  if (env === 'production') {
    plugins.push(terser())
  }

  const replaceOptions = {
    '__VERSION__': version
  }

  if (env) {
    replaceOptions['process.env.NODE_ENV'] = JSON.stringify(env)
  }
  plugins.push(replace(replaceOptions))

  return plugins
}

function generateConfig (target, options, moduleName, version) {
  const plugins = setupPlugins(target, version, options.env, options.format)
  return {
    input: options.entry,
    output: {
      file: options.dest,
      name: moduleName,
      format: options.format,
      banner: options.banner,
      globals: {
        vue: 'Vue'
      }
      // TODO: sourcemap: 'inline'
    },
    // https://github.com/rollup/rollup/issues/1514#issuecomment-320438924
    external: Object.keys(dependencies),
    plugins
  }
}

function getAllEntries ({ name, version }, { entry, dest }, banner) {
  const moduleName = classify(name)
  const entries = makeEntries(entry, dest, moduleName, name, banner)
  return Object.keys(entries)
    .map(name => generateConfig(dest, entries[name], moduleName, version))
}

function bundleEntry (config) {
  const output = config.output
  const { file } = output
  const isProd = /min\.js$/.test(file)
  return rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ output: [{ code }] }) => write(file, code, isProd))
}

async function bundle (entries) {
  console.log('Building for production mode as plugin ...')

  for (let i = 0; i < entries.length; i++) {
    try {
      await bundleEntry(entries[i])
    } catch (e) {
      console.error(e)
    }
  }

  console.log()
  console.log(`✅  Build complete. The ${chalk.cyan('dist')} directory is ready to be deployed.`)
}

function run () {
  const target = process.cwd()
  const { name, license, version, author } = loadPackage(target)

  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist')
  }

  const inOut = {
    entry: 'src/index.ts',
    dest: target
  }
  const entries = getAllEntries(
    { name, version },
    inOut,
    banner({
      name,
      version,
      author: author.name,
      year: new Date().getFullYear(),
      license
    })
  )

  return bundle(entries)
}

// run the buiulding!
run()
