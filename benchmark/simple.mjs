import { createCommonJS } from 'mlly'
import {
  translate,
  createCoreContext,
  clearCompileCache
} from '@intlify/core-base'
import { createI18n } from 'vue-i18n'
import { resolve, dirname } from 'pathe'
import { readJson } from './utils.mjs'

const { require } = createCommonJS(import.meta.url)
const { Suite } = require('benchmark')

async function main() {
  const data = await readJson(resolve(dirname('.'), './benchmark/simple.json'))
  const len = Object.keys(data).length

  console.log(`simple pattern on ${len} resources:`)
  console.log()

  let i18n

  new Suite('complex pattern')
    .add(`resolve time with core`, () => {
      const ctx = createCoreContext({
        locale: 'en',
        messages: {
          en: data
        }
      })
      for (const [key] of Object.entries(data)) {
        translate(ctx, key)
      }
    })
    .add(`resolve time on composition`, () => {
      clearCompileCache()

      i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages: {
          en: data
        }
      })
      for (const [key] of Object.entries(data)) {
        i18n.global.t(key)
      }
    })
    .add(`resolve time on composition with compile cache`, () => {
      for (const [key] of Object.entries(data)) {
        i18n.global.t(key)
      }
    })
    .on('error', event => {
      console.log(String(event.target))
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .run()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
