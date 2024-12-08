global.__INTLIFY_JIT_COMPILATION__ = true // set JIT mode for Node.js

import {
  clearCompileCache,
  compile,
  createCoreContext,
  registerMessageCompiler,
  translate
} from '@intlify/core-base'
import { baseCompile } from '@intlify/message-compiler'
import { bench, run } from 'mitata'
import { dirname, resolve } from 'node:path'
import { createI18n } from 'vue-i18n'
import { displayMemoryUsage, parseArgs, readJson } from './utils.mjs'

const args = parseArgs()
function precompile(data) {
  const keys = Object.keys(data)
  keys.forEach(key => {
    const { ast } = baseCompile(data[key], { jit: true, location: false })
    data[key] = ast
  })
  return data
}

const resources = await readJson(
  resolve(dirname('.'), './benchmark/simple.json')
)
const len = Object.keys(resources).length
console.log(`simple pattern on ${len} resources (JIT + AOT):`)

registerMessageCompiler(compile)
const precompiledResources = precompile(resources)

const ctx = createCoreContext({
  locale: 'en',
  messages: {
    en: precompiledResources
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: precompiledResources
  }
})

bench(`resolve time with core`, () => {
  translate(ctx, 'hello500')
})

bench(`resolve time on composition`, () => {
  clearCompileCache()
  i18n.global.t('hello500')
})

bench(`resolve time on composition with compile cache`, () => {
  i18n.global.t('hello500')
})

await run(args)

displayMemoryUsage()
