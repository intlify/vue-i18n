/**
 * @vitest-environment jsdom
 */

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn(),
    warnOnce: vi.fn()
  }
})

import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'
import { defineComponent, defineCustomElement, h, nextTick, ref } from 'vue'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { createI18n, useI18n } from '../src/i18n'
import { getCurrentInstance } from '../src/utils'
import { pluralRules as _pluralRules, mount, randStr } from './helper'

import type { App, ComponentOptions } from 'vue'
import type { Composer } from '../src/composer'
import type { I18n } from '../src/i18n'

// allow any in error
const container = document.createElement('div')
document.body.appendChild(container)

beforeAll(() => {
  registerMessageCompiler(compile)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

beforeEach(() => {
  container.innerHTML = ''
})

test('createI18n with flat json messages', () => {
  const i18n = createI18n({
    flatJson: true,
    messages: {
      en: { 'mainMenu.buttonStart': 'Start!' }
    }
  })
  const messages = i18n.global.messages.value
  // @ts-ignore
  expect(messages.en.mainMenu.buttonStart).toEqual('Start!')
})

describe('useI18n', () => {
  let org: any
  let spy: any
  beforeEach(() => {
    org = console.warn
    spy = vi.fn()
    console.warn = spy
  })
  afterEach(() => {
    console.warn = org
  })

  test('basic', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        composer = useI18n({
          inheritLocale: false,
          locale: 'en',
          messages: {
            en: {
              hello: 'hello!'
            }
          }
        })
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global).not.toEqual(composer)
    expect((composer as Composer).locale.value).toEqual('en')
  })

  test('global scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        composer = useI18n({ useScope: 'global' })
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global).toEqual(composer)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test('parent scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let leaf: unknown
    let parent: unknown
    const App = defineComponent({
      components: {
        Leaf: {
          template: '<p>local</p>',
          setup() {
            leaf = useI18n({ useScope: 'parent' })
            return {}
          }
        }
      },
      setup() {
        parent = useI18n({
          inheritLocale: false,
          locale: 'en',
          messages: {
            en: {
              hello: 'hello!'
            }
          }
        })
        return {}
      },
      template: `<div>parent</div><Leaf />`
    })
    await mount(App, i18n)

    expect(i18n.global).not.toEqual(leaf)
    expect(i18n.global).not.toEqual(parent)
    expect(parent).toEqual(leaf)
    expect((leaf as Composer).locale.value).toEqual('en')
  })

  test('not found parent composer with parent scope', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      components: {
        Leaf: {
          template: '<p>local</p>',
          setup() {
            composer = useI18n({ useScope: 'parent' })
            return {}
          }
        }
      },
      setup() {
        return {}
      },
      template: `<div>parent</div><Leaf />`
    })
    await mount(App, i18n)

    expect(i18n.global).toEqual(composer)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test('empty options', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        composer = useI18n()
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)

    expect(i18n.global).toEqual(composer)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test('empty options, when have i18n custom blocks', async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let composer: unknown
    const App = defineComponent({
      setup() {
        const instance = getCurrentInstance()
        if (instance == null) {
          throw new Error()
        }
        const options = instance.type as ComponentOptions
        options.__i18n = [
          {
            locale: '',
            resource: { en: { hello: 'Hello,world!' } }
          },
          {
            locale: '',
            resource: { ja: { hello: 'こんにちは、世界！' } }
          }
        ] as any
        composer = useI18n()
        return { t: (composer as Composer).t }
      },
      template: `<p>{{ t('hello', ['foo'], { locale: 'ja' }) }}</p>`
    })
    const { html } = await mount(App, i18n)

    expect(html()).toEqual('<p>こんにちは、世界！</p>')
    expect(i18n.global).not.toEqual(composer)
    expect((composer as Composer).locale.value).toEqual('ja')
  })

  test(errorMessages[I18nErrorCodes.MUST_BE_CALL_SETUP_TOP], async () => {
    let error = ''
    try {
      // eslint-disable-next-line vue-composable/composable-placement
      useI18n({})
    } catch (e: any) {
      error = e.message
    }
    expect(error).toEqual(errorMessages[I18nErrorCodes.MUST_BE_CALL_SETUP_TOP])
  })

  test(errorMessages[I18nErrorCodes.NOT_INSTALLED], async () => {
    const i18n = createI18n({
      locale: 'ja',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    let error = ''
    const App = defineComponent({
      setup() {
        try {
          useI18n({})
        } catch (e: any) {
          error = e.message
        }
        return {}
      }
    })
    await mount(App, i18n, { installI18n: false })
    expect(error).toEqual(errorMessages[I18nErrorCodes.NOT_INSTALLED])
  })

  test(errorMessages[I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE], async () => {
    const randCusumerTag = `my-consumer-${randStr()}`
    const randProviderTag = `my-provider-${randStr()}`
    const Provider = defineCustomElement({
      setup() {
        createI18n({})
        return () => h(randCusumerTag)
      }
    })
    customElements.define(randProviderTag, Provider)

    let error = ''
    const Consumer = defineCustomElement({
      setup() {
        try {
          useI18n()
        } catch (e: any) {
          error = e.message
        }
        return () => h('div')
      }
    })
    customElements.define(randCusumerTag, Consumer)

    container.innerHTML = `<${randProviderTag}></${randProviderTag}>`
    await nextTick()

    expect(error).toEqual(errorMessages[I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE])
  })

  test(errorMessages[I18nErrorCodes.DUPLICATE_USE_I18N_CALLING], async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: ['en'],
      messages: {
        en: { hello: 'hello!' }
      }
    })

    const useMyComposable = () => {
      const count = ref(0)
      const { t } = useI18n({
        messages: {
          en: {
            there: 'hi there! {count}'
          }
        }
      })
      return { message: t('there', { count: count.value }) }
    }

    let error = ''
    const App = defineComponent({
      setup() {
        let message: string = ''
        let t: any
        try {
          const i18n = useI18n({
            messages: {
              en: {
                hi: 'hi!'
              }
            }
          })
          t = i18n.t
          const ret = useMyComposable()
          message = ret.message
        } catch (e: any) {
          error = e.message
        }
        return { t, message, error }
      },
      template: `
        <h1>Root</h1>
          <form>
            <select v-model="locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ t('hi') }}</p>
          <p>{{ message }}</p>
          <p>{{ error }}</p>
      `
    })
    await mount(App, i18n as any)
    expect(error).toBe(errorMessages[I18nErrorCodes.DUPLICATE_USE_I18N_CALLING])
  })

  describe('isolated scope', () => {
    test('basic', async () => {
      const i18n = createI18n({
        locale: 'en',
        messages: {
          en: {
            hello: 'hello!'
          }
        }
      })

      let composer: unknown
      const App = defineComponent({
        setup() {
          composer = useI18n({
            useScope: 'isolated',
            messages: {
              en: {
                greeting: 'hi there!'
              }
            }
          })
          return {}
        },
        template: `<p>foo</p>`
      })
      await mount(App, i18n)

      expect(i18n.global).not.toEqual(composer)
      expect((composer as Composer).t('greeting')).toEqual('hi there!')
    })

    test('multiple isolated scopes per component', async () => {
      const i18n = createI18n({
        locale: 'en',
        messages: {
          en: {
            hello: 'hello!'
          }
        }
      })

      let composer1: unknown
      let composer2: unknown
      const App = defineComponent({
        setup() {
          composer1 = useI18n({
            useScope: 'isolated',
            messages: {
              en: { msg: 'from first' }
            }
          })
          composer2 = useI18n({
            useScope: 'isolated',
            messages: {
              en: { msg: 'from second' }
            }
          })
          return {}
        },
        template: `<p>foo</p>`
      })
      await mount(App, i18n)

      expect((composer1 as Composer).t('msg')).toEqual('from first')
      expect((composer2 as Composer).t('msg')).toEqual('from second')
      expect(composer1).not.toEqual(composer2)
    })

    test('coexists with local scope', async () => {
      const i18n = createI18n({
        locale: 'en',
        messages: {
          en: {
            hello: 'hello!'
          }
        }
      })

      const useMyComposable = () => {
        const { t } = useI18n({
          useScope: 'isolated',
          messages: {
            en: {
              status: 'composable status'
            }
          }
        })
        return { status: t('status') }
      }

      let localComposer: unknown
      let composableResult: { status: string }
      const App = defineComponent({
        setup() {
          localComposer = useI18n({
            messages: {
              en: { hi: 'hi from component!' }
            }
          })
          composableResult = useMyComposable()
          return {}
        },
        template: `<p>foo</p>`
      })
      await mount(App, i18n)

      expect((localComposer as Composer).t('hi')).toEqual('hi from component!')
      expect(composableResult!.status).toEqual('composable status')
    })

    test('inherits locale from global', async () => {
      const i18n = createI18n({
        locale: 'ja',
        messages: {
          en: { hello: 'hello!' },
          ja: { hello: 'こんにちは！' }
        }
      })

      let composer: unknown
      const App = defineComponent({
        setup() {
          composer = useI18n({
            useScope: 'isolated',
            messages: {
              en: { greeting: 'hi!' },
              ja: { greeting: 'やあ！' }
            }
          })
          return {}
        },
        template: `<p>foo</p>`
      })
      await mount(App, i18n)

      expect((composer as Composer).locale.value).toEqual('ja')
      expect((composer as Composer).t('greeting')).toEqual('やあ！')
    })

    test('falls back to root for missing keys', async () => {
      const i18n = createI18n({
        locale: 'en',
        messages: {
          en: { globalKey: 'from global' }
        }
      })

      let composer: unknown
      const App = defineComponent({
        setup() {
          composer = useI18n({
            useScope: 'isolated',
            messages: {
              en: { localKey: 'from isolated' }
            }
          })
          return {}
        },
        template: `<p>foo</p>`
      })
      await mount(App, i18n)

      expect((composer as Composer).t('localKey')).toEqual('from isolated')
      expect((composer as Composer).t('globalKey')).toEqual('from global')
    })
  })
})

test('slot reactivity', async () => {
  let org: any
  let spy: any
  beforeEach(() => {
    org = console.warn
    spy = vi.fn()
    console.warn = spy
  })
  afterEach(() => {
    console.warn = org
  })

  const i18n = createI18n({
    locale: 'ja',
    fallbackLocale: ['en'],
    messages: {
      en: {
        hello: 'hello!'
      },
      ja: {
        hello: 'こんにちは！'
      }
    }
  })

  const SlotChild = {
    template: `<p><slot/></p>`
  }

  const SubChild = {
    template: `
      <div class="sub-child">
        <h1>Sub Child</h1>
        <form>
          <select v-model="locale">
            <option value="en">en</option>
            <option value="ja">ja</option>
          </select>
        </form>
        <p>{{ t('hello') }}</p>
      </div>
    `,
    setup() {
      return useI18n()
    }
  }

  const Child = {
    components: {
      SubChild,
      SlotChild
    },
    template: `
      <div class="child">
        <h1>Child</h1>
        <form>
          <select v-model="locale">
            <option value="en">en</option>
            <option value="ja">ja</option>
          </select>
        </form>
        <p>{{ t('hello') }}</p>
        <SubChild />
        t inside of slot
        <SlotChild>
          {{ t('hello') }}
        </SlotChild>
        i18n-t inside of slot
        <SlotChild>
          <i18n-t keypath='hello' />
        </SlotChild>
      </div>
    `,
    setup() {
      return useI18n()
    }
  }

  const App = defineComponent({
    components: {
      Child
    },
    setup() {
      return useI18n()
    },
    template: `
      <h1>Root</h1>
      <form>
        <select v-model="locale">
          <option value="en">en</option>
          <option value="ja">ja</option>
        </select>
      </form>
      <p>{{ t('hello') }}</p>
      <Child />
    `
  })
  const { html } = await mount(App, i18n as any)
  expect(html()).toMatchSnapshot('ja')
  i18n.global.locale.value = 'en'
  await nextTick()
  expect(html()).toMatchSnapshot('en')
})

test('multi instance', async () => {
  const i18n1 = createI18n({
    locale: 'ja',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })
  const i18n2 = createI18n({
    locale: 'en',
    messages: {
      ja: {
        hello: 'こんにちは！'
      }
    }
  })

  const App = defineComponent({
    setup() {
      const i18n = useI18n({
        locale: 'en',
        messages: {
          en: {
            hello: 'hello!'
          }
        }
      })
      return { ...i18n }
    },
    template: `<p>foo</p>`
  })
  const { app: app1 } = await mount(App, i18n1)
  const { app: app2 } = await mount(App, i18n2)

  expect(app1.__VUE_I18N_SYMBOL__).not.toEqual(app2.__VUE_I18N_SYMBOL__)
  expect(i18n1.global).not.toEqual(i18n2.global)
})

test('merge useI18n resources to global scope', async () => {
  const i18n = createI18n({
    locale: 'ja',
    messages: {
      en: {
        hi: { hello: 'hello!' }
      }
    }
  })

  const App = defineComponent({
    setup() {
      useI18n({
        useScope: 'global',
        messages: {
          en: {
            hi: { hi: 'hi!' }
          },
          ja: {
            hello: 'こんにちは！'
          }
        },
        datetimeFormats: {
          'en-US': {
            short: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }
          }
        },
        numberFormats: {
          'en-US': {
            currency: {
              style: 'currency',
              currency: 'USD',
              currencyDisplay: 'symbol'
            }
          }
        }
      })
      return {}
    },
    template: `<p>foo</p>`
  })
  await mount(App, i18n)

  expect(i18n.global.getLocaleMessage('en')).toEqual({
    hi: {
      hi: 'hi!',
      hello: 'hello!'
    }
  })
  expect(i18n.global.getLocaleMessage('ja')).toEqual({ hello: 'こんにちは！' })
  expect(i18n.global.getDateTimeFormat('en-US')).toEqual({
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }
  })
  expect(i18n.global.getNumberFormat('en-US')).toEqual({
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }
  })
})

test('merge i18n custom blocks to global scope', async () => {
  const i18n = createI18n({
    locale: 'ja',
    messages: {
      en: {
        hi: { hello: 'hello!' }
      }
    }
  })

  const App = defineComponent({
    setup() {
      const instance = getCurrentInstance()
      if (instance == null) {
        throw new Error()
      }
      const options = instance.type as ComponentOptions
      options.__i18nGlobal = [
        {
          locale: 'en',
          resource: {
            hi: { hi: 'hi!' },
            foo: 'foo!'
          }
        },
        {
          locale: 'ja',
          resource: { foo: 'ふー！' }
        }
      ]
      useI18n({
        useScope: 'global',
        messages: {
          ja: {
            hello: 'こんにちは！'
          }
        }
      })
      return {}
    },
    template: `<p>foo</p>`
  })
  await mount(App, i18n)

  expect(i18n.global.getLocaleMessage('en')).toEqual({
    hi: {
      hi: 'hi!',
      hello: 'hello!'
    },
    foo: 'foo!'
  })
  expect(i18n.global.getLocaleMessage('ja')).toEqual({
    hello: 'こんにちは！',
    foo: 'ふー！'
  })
})

describe('custom pluralization', () => {
  const mockWarn = vi.spyOn(shared, 'warnOnce')

  mockWarn.mockImplementation(() => {})

  test('pluralization', async () => {
    const i18n = createI18n({
      locale: 'ru',
      pluralRules: _pluralRules,
      messages: {
        ru: {
          car: '0 машин | {n} машина | {n} машины | {n} машин'
        }
      }
    })

    const App = defineComponent({
      setup() {
        const { t } = useI18n()
        return { t }
      },
      template: `
        <p>{{ t('car', 1) }}</p>
        <p>{{ t('car', 2) }}</p>
        <p>{{ t('car', 4) }}</p>
        <p>{{ t('car', 12) }}</p>
        <p>{{ t('car', 21) }}</p>
      `
    })
    const { find } = await mount(App, i18n)
    await nextTick()
    expect(find('p:nth-child(1)')!.innerHTML).toEqual('1 машина')
    expect(find('p:nth-child(2)')!.innerHTML).toEqual('2 машины')
    expect(find('p:nth-child(3)')!.innerHTML).toEqual('4 машины')
    expect(find('p:nth-child(4)')!.innerHTML).toEqual('12 машин')
    expect(find('p:nth-child(5)')!.innerHTML).toEqual('21 машина')
  })

  test('custom block', async () => {
    const i18n = createI18n({
      locale: 'ru'
    })

    const App = defineComponent({
      setup() {
        const instance = getCurrentInstance()
        if (instance == null) {
          throw new Error()
        }
        const options = instance.type as ComponentOptions
        options.__i18n = [
          {
            locale: 'ru',
            resource: {
              car: '0 машин | {n} машина | {n} машины | {n} машин'
            }
          }
        ]
        const { t } = useI18n({
          inheritLocale: true,
          useScope: 'local',
          pluralRules: _pluralRules
        })
        return { t }
      },
      template: `
        <p>{{ t('car', 1) }}</p>
        <p>{{ t('car', 2) }}</p>
        <p>{{ t('car', 4) }}</p>
        <p>{{ t('car', 12) }}</p>
        <p>{{ t('car', 21) }}</p>
      `
    })
    const { find } = await mount(App, i18n)
    await nextTick()
    expect(find('p:nth-child(1)')!.innerHTML).toEqual('1 машина')
    expect(find('p:nth-child(2)')!.innerHTML).toEqual('2 машины')
    expect(find('p:nth-child(3)')!.innerHTML).toEqual('4 машины')
    expect(find('p:nth-child(4)')!.innerHTML).toEqual('12 машин')
    expect(find('p:nth-child(5)')!.innerHTML).toEqual('21 машина')
  })
})

describe('release global scope', () => {
  test('call dispose', () => {
    let i18n: I18n | undefined
    let error = ''
    try {
      i18n = createI18n({})
    } catch (e: any) {
      error = e.message
    } finally {
      i18n!.dispose()
    }
    expect(error).not.toEqual(errorMessages[I18nErrorCodes.UNEXPECTED_ERROR])
  })

  test('unmount', async () => {
    let app: App | undefined
    let error = ''
    try {
      const i18n = createI18n({
        locale: 'ja',
        messages: {}
      })
      const wrapper = await mount({ template: '<p>unmound</p>' }, i18n)
      app = wrapper.app
    } catch (e: any) {
      error = e.message
    } finally {
      app!.unmount()
    }
    expect(error).not.toEqual(errorMessages[I18nErrorCodes.UNEXPECTED_ERROR])
  })
})

test('Composer & VueI18n extend hooking', async () => {
  const composerDisposeSpy = vi.fn()
  let counter = 0
  const composerExtendSpy = vi.fn().mockImplementation((composer: Composer) => {
    counter += 1
    ;(composer as any).foo = ref(`foo${counter}`)
    return composerDisposeSpy
  })
  const vueI18nExtendSpy = vi.fn()
  const i18n = createI18n({})

  const GrandChild = defineComponent({
    setup() {
      // @ts-ignore
      const { foo } = useI18n({
        useScope: 'local'
      })
      return { foo }
    },
    template: '<p class="grand-child">{{ foo }}</p>'
  })

  const Child = defineComponent({
    components: {
      GrandChild
    },
    setup() {
      // @ts-ignore
      const { foo } = useI18n({
        useScope: 'local'
      })
      return { foo }
    },
    template: '<p class="child">{{ foo }}</p><GrandChild />'
  })

  const App = defineComponent({
    components: {
      Child
    },
    setup() {
      // @ts-ignore
      const { foo } = useI18n() // global scope
      return { foo }
    },
    template: '<p>{{ foo }}</p><Child />'
  })
  const { html, app } = await mount(App, i18n, {
    pluginOptions: {
      __composerExtend: composerExtendSpy,
      __vueI18nExtend: vueI18nExtendSpy
    } as any
  })

  // Check that global is not extended
  expect((i18n.global as any).foo).toBeUndefined()

  expect(html()).toBe('<p></p><p class="child">foo1</p><p class="grand-child">foo2</p>')
  expect(composerExtendSpy).toHaveBeenCalledTimes(2)
  expect(vueI18nExtendSpy).not.toHaveBeenCalled()

  // dispose checking
  app.unmount()
  expect(composerDisposeSpy).toHaveBeenCalledTimes(2)
})

test('dollar prefixed API (component injections)', async () => {
  const mockWarn = vi.spyOn(shared, 'warn')

  mockWarn.mockImplementation(() => {})

  const messages = {
    en: {
      hello: 'hello world!',
      list: 'hello, {0}!',
      named: 'hello, {name}!',
      plural: 'no apples | one apple | {count} apples'
    },
    ja: {
      hello: 'こんにちは、世界！',
      list: 'こんにちは、{0}！',
      named: 'こんにちは、{name}！',
      plural: 'りんご無い | りんご1個 | りんご{count}個'
    }
  }

  const i18n = createI18n({
    locale: 'en',
    messages
  })
  const App = defineComponent({
    setup() {
      useI18n()
      return {}
    },
    template: `<div>
<p>{{ $t('hello') }}</p>
<p>{{ $t('list', ['world']) }}</p>
<p>{{ $t('named', { name: 'world' }) }}</p>
<p>{{ $t('plural', 0) }}</p>
<p>{{ $t('plural', 1, { locale: 'ja' }) }}</p>
<p>{{ $t('default', 'default message') }}</p>
<p>{{ $t('default', 'default {msg}', { named: { msg: 'msg' } }) }}</p>
<p>{{ $t('plural', ['many'], 4) }}</p>
<p>{{ $t('default', ['list msg'], 'default {0}') }}</p>
<p>{{ $t('list', ['世界'], { locale: 'ja' }) }}</p>
<p>{{ $t('plural', { count: 'many' }, 4) }}</p>
<p>{{ $t('default', { msg: 'named msg' }, 'default {msg}') }}</p>
<p>{{ $t('named', { name: '世界' }, { locale: 'ja' }) }}</p>
<p>{{ $t('hello', {}, { locale: 'en' }) }}</p>
<p>{{ $t('hello', [], { locale: 'ja' }) }}</p>
</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    '<div><p>hello world!</p><p>hello, world!</p><p>hello, world!</p><p>no apples</p><p>りんご1個</p><p>default message</p><p>default msg</p><p>4 apples</p><p>default list msg</p><p>こんにちは、世界！</p><p>many apples</p><p>default named msg</p><p>こんにちは、世界！</p><p>hello world!</p><p>こんにちは、世界！</p></div>'
  )
})

test('`t`', async () => {
  const messages = {
    en: {
      hello: 'hello world!',
      list: 'hello, {0}!',
      named: 'hello, {name}!',
      plural: 'no apples | one apple | {count} apples'
    },
    ja: {
      hello: 'こんにちは、世界！',
      list: 'こんにちは、{0}！',
      named: 'こんにちは、{name}！',
      plural: 'りんご無い | りんご1個 | りんご{count}個'
    }
  }

  const i18n = createI18n({
    locale: 'en',
    messages
  })

  expect(i18n.global.t('hello')).toEqual('hello world!')
  expect(i18n.global.t('list', ['world'])).toEqual('hello, world!')
  expect(i18n.global.t('named', { name: 'world' })).toEqual('hello, world!')
  expect(i18n.global.t('plural', 0)).toEqual('no apples')
  expect(i18n.global.t('plural', 1)).toEqual('one apple')
  expect(i18n.global.t('default', 'default message')).toEqual('default message')
  expect(i18n.global.t('default', 'default {msg}', { named: { msg: 'msg' } })).toEqual(
    'default msg'
  )
  expect(i18n.global.t('plural', ['many'], 4)).toEqual('4 apples')
  expect(i18n.global.t('default', ['list msg'], 'default {0}')).toEqual('default list msg')
  expect(i18n.global.t('list', ['世界'], { locale: 'ja' })).toEqual('こんにちは、世界！')
  expect(i18n.global.t('plural', { count: 'many' }, 4)).toEqual('many apples')
  expect(i18n.global.t('default', { msg: 'named msg' }, 'default {msg}')).toEqual(
    'default named msg'
  )
  expect(i18n.global.t('named', { name: '世界' }, { locale: 'ja' })).toEqual('こんにちは、世界！')
  expect(i18n.global.t('hello', {}, { locale: 'en' })).toEqual('hello world!')
  expect(i18n.global.t('hello', [], { locale: 'ja' })).toEqual('こんにちは、世界！')
})
