global.__INTLIFY_JIT_COMPILATION__ = true // set JIT mode for Node.js

import { createCommonJS } from 'mlly'
import {
  translate,
  createCoreContext,
  compile,
  registerMessageCompiler,
  clearCompileCache
} from '@intlify/core-base'
import { createI18n } from 'vue-i18n'
import { resolve, dirname } from 'pathe'
import { readJson, displayMemoryUsage } from './utils.mjs'

const { require } = createCommonJS(import.meta.url)
const { Suite } = require('benchmark')

async function main() {
  const resources = await readJson(
    resolve(dirname('.'), './benchmark/simple.json')
  )
  const len = Object.keys(resources).length

  console.log(`simple pattern on ${len} resources (JIT):`)
  console.log()

  registerMessageCompiler(compile)

  const ctx = createCoreContext({
    locale: 'en',
    messages: {
      en: resources
    }
  })
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: resources
    }
  })

  new Suite('simple pattern')
    .add(`resolve time with core`, () => {
      translate(ctx, 'hello500')
    })
    .add(`resolve time on composition`, () => {
      clearCompileCache()
      i18n.global.t('hello500')
    })
    .add(`resolve time on composition with compile cache`, () => {
      i18n.global.t('hello500')
    })
    .on('error', event => {
      console.log(String(event.target))
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .run()

  displayMemoryUsage()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
