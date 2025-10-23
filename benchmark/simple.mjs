import { clearCompileCache, createCoreContext, translate } from '@intlify/core-base' // eslint-disable-line import/namespace -- FIXME:
import { bench, run } from 'mitata' // eslint-disable-line import/namespace -- FIXME:
import { dirname, resolve } from 'node:path'
import { createI18n } from 'vue-i18n'
import { displayMemoryUsage, parseArgs, readJson } from './utils.mjs' // eslint-disable-line import/extensions -- FIXME:

const args = parseArgs()
const resources = await readJson(resolve(dirname('.'), './benchmark/simple.json'))
const len = Object.keys(resources).length
console.log(`simple pattern on ${len} resources (AOT):`)

const ctx = createCoreContext({
  locale: 'en',
  messages: {
    en: resources
  }
})

const i18n = createI18n({
  locale: 'en',
  messages: {
    en: resources
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
