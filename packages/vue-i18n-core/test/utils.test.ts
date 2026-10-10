// utils
import * as shared from '@intlify/shared'
import { createComposer } from '../src/composer'
import { adjustI18nResources, getLocaleMessages, handleFlatJson } from '../src/utils'
import { I18nWarnCodes, getWarnMessage } from '../src/warnings'

import type { Composer } from '../src/composer'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})

describe('handleFlatJson', () => {
  test('basic', () => {
    const mockWarn = vi.spyOn(shared, 'warn')

    mockWarn.mockImplementation(() => {})

    const obj = {
      a: { a1: 'a1.value' },
      'a.a2': 'a.a2.value',
      'b.x': {
        'b1.x': 'b1.x.value',
        'b2.x': ['b2.x.value0', 'b2.x.value1'],
        'b3.x': { 'b3.x': 'b3.x.value' }
      },
      c: {
        'animal.dog': 'Dog',
        animal: 'Animal'
      },
      d: {
        'animal.dog': 'Dog',
        animal: {}
      }
    }
    const expectObj = {
      a: {
        a1: 'a1.value',
        a2: 'a.a2.value'
      },
      b: {
        x: {
          b1: { x: 'b1.x.value' },
          b2: { x: ['b2.x.value0', 'b2.x.value1'] },
          b3: { x: { b3: { x: 'b3.x.value' } } }
        }
      },
      c: {
        'animal.dog': 'Dog',
        animal: 'Animal'
      },
      d: {
        animal: {
          dog: 'Dog'
        }
      }
    }

    expect(handleFlatJson(obj)).toEqual(expectObj)
    expect(mockWarn).toHaveBeenCalled()
    expect(mockWarn.mock.calls[0][0]).toEqual(
      getWarnMessage(I18nWarnCodes.IGNORE_OBJ_FLATTEN, {
        key: 'animal'
      })
    )
  })

  // security advisories
  // ref: https://github.com/intlify/vue-i18n/security/advisories/GHSA-p2ph-7g93-hw3m
  test('prototype pollution', () => {
    expect(() => handleFlatJson({ '__proto__.pollutedKey': 'pollutedValue' })).toThrow()
    // @ts-ignore -- test

    expect({}.__proto__.pollutedKey).toBeUndefined()
    // @ts-ignore -- test
    expect(Object.prototype.pollutedKey).toBeUndefined()
  })

  test('ast has json path', async () => {
    const { ast } = await import('./fixtures/ast')
    expect(handleFlatJson(ast)).toStrictEqual(ast)
  })
})

describe('locales named after Object.prototype properties', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    for (const target of [Object.prototype, Object, Object.prototype.toString]) {
      delete (target as Record<string, unknown>).polluted
    }
  })

  test('getLocaleMessages ignores them in custom blocks', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const messages = { en: { hello: 'hello' } }
    const ret = getLocaleMessages('en', {
      messages,
      __i18n: [
        { locale: '__proto__', resource: { polluted: 'yes' } },
        { locale: 'constructor', resource: { polluted: 'yes' } },
        { locale: 'ja', resource: { hello: 'こんにちは' } }
      ]
    })

    for (const target of [Object.prototype, Object]) {
      expect(Object.prototype.hasOwnProperty.call(target, 'polluted')).toBe(false)
    }
    expect(Object.getPrototypeOf(ret)).toBe(Object.prototype)
    expect(Object.keys(ret)).toEqual(['en', 'ja'])
    expect(mockWarn).toHaveBeenCalledTimes(2)
  })

  test('adjustI18nResources ignores them in the global messages and formats', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})

    const gl = createComposer({ locale: 'en', messages: { en: {} } }) as unknown as Composer
    // e.g. resources parsed from untrusted JSON, where `__proto__` is an own key
    adjustI18nResources(
      gl,
      {
        messages: JSON.parse('{"__proto__": {"polluted": "yes"}, "ja": {"hello": "こんにちは"}}'),
        datetimeFormats: JSON.parse('{"constructor": {"polluted": {"year": "numeric"}}}'),
        numberFormats: JSON.parse('{"toString": {"polluted": {"style": "decimal"}}}')
      },
      {}
    )

    for (const target of [Object.prototype, Object, Object.prototype.toString]) {
      expect(Object.prototype.hasOwnProperty.call(target, 'polluted')).toBe(false)
    }
    expect(gl.getLocaleMessage('ja')).toEqual({ hello: 'こんにちは' })
  })
})

describe('objects passed in as resources', () => {
  test('getLocaleMessages does not write into the messages passed in', () => {
    const messages = { en: { hello: 'hello', nested: { foo: 'foo' } } }
    const ret = getLocaleMessages('en', {
      messages,
      __i18n: [
        { locale: 'en', resource: { bye: 'bye', nested: { bar: 'bar' } } },
        { locale: '', resource: { en: { more: 'more' }, ja: { hello: 'こんにちは' } } }
      ] as any
    })

    expect(messages).toEqual({ en: { hello: 'hello', nested: { foo: 'foo' } } })
    expect(ret).toEqual({
      en: {
        hello: 'hello',
        nested: { foo: 'foo', bar: 'bar' },
        bye: 'bye',
        more: 'more'
      },
      ja: { hello: 'こんにちは' }
    })
  })

  test('getLocaleMessages copies the locales before flatJson rewrites them', () => {
    const messages = { en: { 'a.b': 'flat' } }
    const ret = getLocaleMessages('en', { messages, flatJson: true })

    expect(messages).toEqual({ en: { 'a.b': 'flat' } })
    expect(ret).toEqual({ en: { a: { b: 'flat' } } })
  })

  test('adjustI18nResources does not write into the messages of the component or of the global composer', () => {
    const globalMessages = { en: { hello: 'hello' } }
    const componentMessages = { en: { component: 'component' } }
    const gl = createComposer({ locale: 'en', messages: globalMessages }) as unknown as Composer
    adjustI18nResources(
      gl,
      { messages: componentMessages },
      { __i18nGlobal: [{ locale: 'en', resource: { block: 'block' } }] }
    )

    expect(globalMessages).toEqual({ en: { hello: 'hello' } })
    expect(componentMessages).toEqual({ en: { component: 'component' } })
    expect(gl.getLocaleMessage('en')).toEqual({
      hello: 'hello',
      component: 'component',
      block: 'block'
    })
  })
})
