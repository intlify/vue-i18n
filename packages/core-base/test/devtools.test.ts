import { createCoreContext, translate } from '../src/index'
import { createEmitter } from '@intlify/shared'
import { compileToFunction } from '../src/compile'
import { IntlifyDevToolsHooks } from '@intlify/devtools-if'
import { setDevToolsHook, getDevToolsHook } from '../src/devtools'

import type {
  IntlifyDevToolsEmitterHooks,
  IntlifyDevToolsEmitter
} from '@intlify/devtools-if'

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
  const fn = jest.fn()
  devtools!.on(IntlifyDevToolsHooks.I18N_INIT, fn)

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
    const fn = jest.fn()
    devtools!.on(IntlifyDevToolsHooks.FUNCTION_TRANSLATE, fn)

    const meta = { __INTLIFY_META__: 'xxx', framework: 'Vue' }
    const HELLO = 'Hello {name}!'
    const ctx = createCoreContext({
      locale: 'en',
      messageCompiler: compileToFunction,
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
    const fn = jest.fn()
    devtools!.on(IntlifyDevToolsHooks.FUNCTION_TRANSLATE, fn)

    const HELLO = 'やあ　{name}！'
    const ctx = createCoreContext({
      locale: 'en',
      fallbackLocale: ['ja'],
      messageCompiler: compileToFunction,
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
