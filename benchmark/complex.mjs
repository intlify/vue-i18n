import { createCommonJS } from 'mlly'
import {
  translate,
  createCoreContext,
  clearCompileCache
} from '@intlify/core-base'
import { createI18n } from 'vue-i18n'
import { resolve, dirname } from 'pathe'
import { readJson } from './utils.mjs'

const { require } = createCommonJS(import.meta.url);
const { Suite } = require('benchmark')

async function main() {
  const data = await readJson(resolve(dirname('.'), './benchmark/complex.json'))
  const len = Object.keys(data).length

  console.log(`complex pattern on ${len} resources:`)
  console.log()

  let i18n

  new Suite('complex pattern')
    .add(`resolve time with core`, () => {
      const ctx = createCoreContext({
        locale: 'en',
        modifiers: {
          caml: val => val
        },
        messages: {
          en: data
        }
      })
      for (const [key] of Object.entries(data)) {
        translate(ctx, key, 2)
      }
    })
    .add(`resolve time on composition`, () => {
      clearCompileCache()

      i18n = createI18n({
        legacy: false,
        locale: 'en',
        modifiers: {
          caml: val => val
        },
        messages: {
          en: data
        }
      })

      for (const [key] of Object.entries(data)) {
        i18n.global.t(key, 2)
      }
    })
    .add(`resolve time on composition with compile cache`, () => {
      for (const [key] of Object.entries(data)) {
        i18n.global.t(key, 2)
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

/*
async function run() {
  const data = await readJson(resolve(dirname('.'), './benchmark/complex.json'))
  const len = Object.keys(data).length

  console.log('complex pattern ...')

  console.log(`compile time: ${len} resources`)
  let start = convertHrtime(process.hrtime.bigint())
  for (const [, source] of Object.entries(data)) {
    baseCompile(source)
  }
  let end = convertHrtime(process.hrtime.bigint())
  console.log(`ms: ${end.milliseconds - start.milliseconds}`)

  console.log()

  console.log(`resolve time with core: ${len} resources`)
  const ctx = createCoreContext({
    locale: 'en',
    modifiers: {
      caml: val => val
    },
    messages: {
      en: data
    }
  })
  start = convertHrtime(process.hrtime.bigint())
  for (const [key] of Object.entries(data)) {
    translate(ctx, key, 2)
  }
  end = convertHrtime(process.hrtime.bigint())
  console.log(`sec: ${end.seconds - start.seconds}`)
  console.log(`ms: ${end.milliseconds - start.milliseconds}`)

  clearCompileCache()
  console.log()

  console.log(`resolve time on composition: ${len} resources`)
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    modifiers: {
      caml: val => val
    },
    messages: {
      en: data
    }
  })
  start = convertHrtime(process.hrtime.bigint())
  for (const [key] of Object.entries(data)) {
    i18n.global.t(key, 2)
  }
  end = convertHrtime(process.hrtime.bigint())
  console.log(`ms: ${end.milliseconds - start.milliseconds}`)

  console.log(
    `resolve time on composition with compile cache: ${len} resources`
  )
  start = convertHrtime(process.hrtime.bigint())
  for (const [key] of Object.entries(data)) {
    i18n.global.t(key, 2)
  }
  end = convertHrtime(process.hrtime.bigint())
  console.log(`ms: ${end.milliseconds - start.milliseconds}`)
}

;(async () => {
  try {
    await run()
  } catch (e) {
    console.error(e)
  }
})()
*/