global.__INTLIFY_JIT_COMPILATION__ = true // set JIT mode for Node.js

import {
  clearCompileCache,
  compile,
  createCoreContext,
  registerMessageCompiler,
  translate
} from '@intlify/core-base'
import { createCommonJS } from 'mlly'
import { dirname, resolve } from 'node:path'
import { createI18n } from 'vue-i18n'
import { displayMemoryUsage, readJson } from './utils.mjs'

const { require } = createCommonJS(import.meta.url)
const { Suite } = require('benchmark')

async function main() {
  const resources = await readJson(
    resolve(dirname('.'), './benchmark/complex.json')
  )
  const len = Object.keys(resources).length

  console.log(`complex pattern on ${len} resources (JIT):`)
  console.log()

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

  new Suite('complex pattern')
    .add(`resolve time with core`, () => {
      translate(ctx, 'complex500', 2)
    })
    .add(`resolve time on composition`, () => {
      clearCompileCache()
      i18n.global.t('complex500', 2)
    })
    .add(`resolve time on composition with compile cache`, () => {
      i18n.global.t('complex500', 2)
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
