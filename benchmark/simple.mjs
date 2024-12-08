import {
  clearCompileCache,
  createCoreContext,
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
    resolve(dirname('.'), './benchmark/simple.json')
  )
  const len = Object.keys(resources).length

  console.log(`simple pattern on ${len} resources (AOT):`)
  console.log()

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
