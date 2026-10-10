/**
 * @vitest-environment node
 */

import { createComposer } from '../src/composer'

import type { ComposerOptions } from '../src/composer'

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
    for (const target of [Object.prototype, Object, Object.prototype.toString]) {
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

      for (const target of [Object.prototype, Object, Object.prototype.toString]) {
        expect(Object.prototype.hasOwnProperty.call(target, 'polluted')).toBe(false)
      }
      for (const container of [options.messages, options.datetimeFormats, options.numberFormats]) {
        expect(Object.getPrototypeOf(container)).toBe(Object.prototype)
        expect(Object.keys(container)).toEqual(['en'])
      }
    }
  })
})

describe('objects passed in as resources', () => {
  // `ComposerOptions` keeps the composer untyped, so that any locale can be set
  const create = (options: ComposerOptions) => createComposer(options)

  test('composers that share them do not see the writes of each other', () => {
    const messages = { en: { hello: 'hello' } }
    const a = create({ locale: 'en', messages })
    const b = create({ locale: 'en', missingWarn: false, fallbackWarn: false, messages })
    a.setLocaleMessage('ja', { hello: 'konnichiwa' })
    a.mergeLocaleMessage('en', { bye: 'bye' })

    expect(messages).toEqual({ en: { hello: 'hello' } })
    b.locale.value = 'ja'
    expect(b.t('hello')).toEqual('hello')
    expect(b.te('bye', 'en')).toEqual(false)
    a.locale.value = 'ja'
    expect(a.t('hello')).toEqual('konnichiwa')
  })
})

describe('lookups with locales and keys named after Object.prototype properties', () => {
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
