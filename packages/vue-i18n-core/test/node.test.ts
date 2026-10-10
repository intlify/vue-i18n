/**
 * @vitest-environment node
 */

import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'
import { createComposer } from '../src/composer'

// without `window`, the composer keeps the messages and formats in a `shallowRef`, as during SSR
test('runs without window', () => {
  expect(typeof window).toEqual('undefined')
})

describe('locales named after Object.prototype properties', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    for (const target of [
      Object.prototype,
      Object,
      Object.prototype.toString
    ]) {
      delete (target as Record<string, unknown>).polluted
    }
  })

  test.each([
    'setLocaleMessage',
    'mergeLocaleMessage',
    'setDateTimeFormat',
    'mergeDateTimeFormat',
    'setNumberFormat',
    'mergeNumberFormat'
  ])('%s ignores them', method => {
    for (const locale of ['__proto__', 'constructor', 'toString']) {
      const options = {
        locale: 'en',
        messages: { en: {} },
        datetimeFormats: { en: {} },
        numberFormats: { en: {} }
      }
      const composer = createComposer(options) as unknown as Record<
        string,
        (locale: string, value: unknown) => void
      >
      composer[method](locale, { polluted: {} })

      for (const target of [
        Object.prototype,
        Object,
        Object.prototype.toString
      ]) {
        expect(Object.prototype.hasOwnProperty.call(target, 'polluted')).toBe(
          false
        )
      }
      for (const container of [
        options.messages,
        options.datetimeFormats,
        options.numberFormats
      ]) {
        expect(Object.getPrototypeOf(container)).toBe(Object.prototype)
        expect(Object.keys(container)).toEqual(['en'])
      }
    }
  })
})

describe('lookups with locales and keys named after Object.prototype properties', () => {
  beforeEach(() => {
    registerMessageCompiler(compile)
    registerMessageResolver(resolveValue)
    registerLocaleFallbacker(fallbackWithLocaleChain)
  })

  test('t and te do not read built-in objects', () => {
    const composer = createComposer({
      locale: 'constructor',
      fallbackLocale: 'en',
      missingWarn: false,
      fallbackWarn: false,
      messages: { en: { name: 'Name', keys: 'Keys' } }
    })
    expect(composer.t('name')).toEqual('Name')
    expect(composer.t('keys')).toEqual('Keys')
    expect(composer.te('toString')).toBe(false)
  })
})
