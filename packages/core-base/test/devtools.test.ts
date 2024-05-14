import { createEmitter } from '@intlify/shared'
import { createCoreContext, translate } from '../src/index'
import { compile } from '../src/compilation'
import { setDevToolsHook, getDevToolsHook } from '../src/devtools'

import type {
  IntlifyDevToolsEmitterHooks,
  IntlifyDevToolsEmitter
} from '@intlify/devtools-types'

let devtools: IntlifyDevToolsEmitter | null = null
beforeEach(() => {
  const emitter = createEmitter<IntlifyDevToolsEmitterHooks>()
  setDevToolsHook(emitter)
  devtools = getDevToolsHook()
})

afterEach(() => {
  setDevToolsHook(null)
  devtools = null
})

test('initI18nDevTools', () => {
  const fn = vi.fn()
  devtools!.on('i18n:init', fn)

  const meta = { framework: 'Vue' }
  const ctx = createCoreContext({
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello!'
      }
    },
    __meta: meta
  })

  expect(fn).toBeCalled()
  expect(fn.mock.calls[0][0]).toMatchObject({
    i18n: ctx,
    meta
  })
})

describe('translateDevTools', () => {
  test('basic', () => {
    const fn = vi.fn()
    devtools!.on('function:translate', fn)

    const meta = { __INTLIFY_META__: 'xxx', framework: 'Vue' }
    const HELLO = 'Hello {name}!'
    const ctx = createCoreContext({
      locale: 'en',
      messageCompiler: compile,
      messages: {
        en: {
          hello: HELLO
        }
      },
      __meta: meta
    })

    const translated = translate(ctx, 'hello', { name: 'DIO' })
    expect(fn.mock.calls[0][0]).toMatchObject({
      key: 'hello',
      message: translated,
      format: HELLO,
      locale: 'en',
      meta
    })
  })

  test('fallback', () => {
    const fn = vi.fn()
    devtools!.on('function:translate', fn)

    const HELLO = 'やあ　{name}！'
    const ctx = createCoreContext({
      locale: 'en',
      fallbackLocale: ['ja'],
      messageCompiler: compile,
      messages: {
        ja: {
          hello: HELLO
        }
      }
    })

    const translated = translate(
      ctx,
      'hello',
      { name: 'ディオ' },
      { locale: 'ja' }
    )
    expect(fn.mock.calls[0][0]).toMatchObject({
      key: 'hello',
      message: translated,
      format: HELLO,
      locale: 'ja'
    })
  })
})
