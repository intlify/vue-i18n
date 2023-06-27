import { createCommonJS } from 'mlly'
import { baseCompile } from '@intlify/message-compiler'
import {
  translate,
  createCoreContext,
  compile,
  registerMessageCompiler,
  clearCompileCache
} from '@intlify/core-base'
import { createI18n } from 'vue-i18n'
import { resolve, dirname } from 'pathe'
import { readJson } from './utils.mjs'

const { require } = createCommonJS(import.meta.url)
const { Suite } = require('benchmark')

function precompile(data) {
  const keys = Object.keys(data)
  keys.forEach(key => {
    const { ast } = baseCompile(data[key], { jit: true, location: false })
    data[key] = ast
  })
  return data
}

async function main() {
  const resources = await readJson(
    resolve(dirname('.'), './benchmark/complex.json')
  )
  const len = Object.keys(resources).length

  console.log(`complex pattern on ${len} resources (JIT + AOT):`)
  console.log()

  registerMessageCompiler(compile)
  const precompiledResources = precompile(resources)

  const ctx = createCoreContext({
    locale: 'en',
    modifiers: {
      caml: val => val
    },
    messages: {
      en: precompiledResources
    }
  })

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    modifiers: {
      caml: val => val
    },
    messages: {
      en: precompiledResources
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
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
