import { baseCompile } from '@intlify/message-compiler'
import {
  translate,
  createCoreContext,
  clearCompileCache
} from '@intlify/core-base'
import { createI18n } from 'vue-i18n'
import convertHrtime from 'convert-hrtime'
import { resolve, dirname } from 'pathe'
import { readJson } from './utils.mjs'

async function run() {
  const simpleData = await readJson(
    resolve(dirname('.'), './benchmark/simple.json')
  )
  const len = Object.keys(simpleData).length

  console.log('simple pattern ...')

  console.log(`compile time: ${len} resources`)
  let start = convertHrtime(process.hrtime.bigint())
  for (const [, source] of Object.entries(simpleData)) {
    baseCompile(source)
  }
  let end = convertHrtime(process.hrtime.bigint())
  console.log(`sec: ${end.seconds - start.seconds}`)
  console.log(`ms: ${end.milliseconds - start.milliseconds}`)

  console.log()

  console.log(`resolve time with core: ${len} resources`)
  const ctx = createCoreContext({
    locale: 'en',
    messages: {
      en: simpleData
    }
  })
  start = convertHrtime(process.hrtime.bigint())
  for (const [key] of Object.entries(simpleData)) {
    translate(ctx, key)
  }
  end = convertHrtime(process.hrtime.bigint())
  console.log(`ms: ${end.milliseconds - start.milliseconds}`)

  clearCompileCache()
  console.log()

  console.log(`resolve time on composition: ${len} resources`)
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: simpleData
    }
  })
  start = convertHrtime(process.hrtime.bigint())
  for (const [key] of Object.entries(simpleData)) {
    i18n.global.t(key)
  }
  end = convertHrtime(process.hrtime.bigint())
  console.log(`ms: ${end.milliseconds - start.milliseconds}`)

  console.log(
    `resolve time on composition with compile cache: ${len} resources`
  )
  start = convertHrtime(process.hrtime.bigint())
  for (const [key] of Object.entries(simpleData)) {
    i18n.global.t(key)
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
