global.__INTLIFY_JIT_COMPILATION__ = true // set JIT mode for Node.js

import {
  clearCompileCache,
  compile,
  createCoreContext,
  registerMessageCompiler,
  translate
} from '@intlify/core-base'
import { bench, run } from 'mitata'
import { dirname, resolve } from 'node:path'
import { createI18n } from 'vue-i18n'
import { displayMemoryUsage, parseArgs, readJson } from './utils.mjs'

const args = parseArgs()
const resources = await readJson(
  resolve(dirname('.'), './benchmark/complex.json')
)
const len = Object.keys(resources).length
console.log(`complex pattern on ${len} resources (JIT):`)

resources['no apples'] = 'no apples'

registerMessageCompiler(compile)

const ctx = createCoreContext({
  locale: 'en',
  modifiers: {
    caml: val => val
  },
  messages: {
    en: resources
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  modifiers: {
    caml: val => val
  },
  messages: {
    en: resources
  }
})

bench(`resolve time with core`, () => {
  translate(ctx, 'complex500', 2)
})

bench(`resolve time on composition`, () => {
  clearCompileCache()
  i18n.global.t('complex500', 2)
})

bench(`resolve time on composition with compile cache`, () => {
  i18n.global.t('complex500', 2)
})

await run(args)

displayMemoryUsage()
