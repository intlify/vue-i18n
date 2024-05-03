/**
 * @vitest-environment jsdom
 */

// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})

import {
  h,
  ref,
  defineComponent,
  defineCustomElement,
  nextTick,
  getCurrentInstance,
  ComponentOptions
} from 'vue'
import {
  setDevToolsHook,
  compileToFunction,
  registerMessageCompiler,
  resolveValue,
  registerMessageResolver,
  fallbackWithLocaleChain,
  registerLocaleFallbacker
} from '@intlify/core-base'
import { createEmitter } from '@intlify/shared'
import { mount, pluralRules as _pluralRules, randStr } from './helper'
import { createI18n, useI18n } from '../src/i18n'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { Composer } from '../src/composer'

import type { IntlifyDevToolsEmitterHooks } from '@intlify/devtools-types'
import type { I18n } from '../src/i18n'
import type { VueI18n } from '../src/legacy'
import type { App } from 'vue'
/* eslint-disable @typescript-eslint/no-explicit-any */
// allow any in error
const container = document.createElement('div')
document.body.appendChild(container)

beforeAll(() => {
  registerMessageCompiler(compileToFunction)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

beforeEach(() => {
  container.innerHTML = ''
})

afterEach(() => {
  setDevToolsHook(null)
})

describe('createI18n', () => {
  test('legacy mode', () => {
    const i18n = createI18n({})

    expect(i18n.mode).toEqual('legacy')
  })

  test('composition mode', () => {
    const i18n = createI18n({
      legacy: false
    })

    expect(i18n.mode).toEqual('composition')
  })
})

describe('createI18n with flat json messages', () => {
  test('legacy mode', () => {
    const i18n = createI18n({
      flatJson: true,
      messages: {
        en: { 'mainMenu.buttonStart': 'Start!' }
      }
    })
    const messages = i18n.global.messages
    // @ts-ignore
    expect(messages.en.mainMenu.buttonStart).toEqual('Start!')
  })

  test('composition mode', () => {
    const i18n = createI18n<false>({
      legacy: false,
      flatJson: true,
      messages: {
        en: { 'mainMenu.buttonStart': 'Start!' }
      }
    })
    const messages = i18n.global.messages.value
    // @ts-ignore
    expect(messages.en.mainMenu.buttonStart).toEqual('Start!')
  })
})

describe('useI18n', () => {
  let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
  let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
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
      legacy: false,
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
      legacy: false,
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

  test('global scope with legacy mode', async () => {
    const i18n = createI18n({
      allowComposition: true,
      legacy: true,
      locale: 'en',
      messages: {
        en: {
          hello: 'hello!'
        }
      }
    })

    const App = defineComponent({
      setup() {
        const { locale, t } = useI18n({
          useScope: 'global'
        })
        return { locale, t }
      },
      i18n: {},
      template: `<p>{{ locale }}:{{ t('hello') }}</p>`
    })
    const { html } = await mount(App, i18n)
    expect(html()).toEqual('<p>en:hello!</p>')
  })

  test('parent scope', async () => {
    const i18n = createI18n({
      legacy: false,
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
      legacy: false,
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
      legacy: false,
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
      legacy: false,
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
        ] as any // eslint-disable-line @typescript-eslint/no-explicit-any
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
      useI18n({})
    } catch (e: any) {
      error = e.message
    }
    expect(error).toEqual(errorMessages[I18nErrorCodes.MUST_BE_CALL_SETUP_TOP])
  })

  test(errorMessages[I18nErrorCodes.NOT_INSTALLED], async () => {
    const i18n = createI18n({
      legacy: false,
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

  describe('On legacy', () => {
    describe('enable', () => {
      describe('t', () => {
        test('translation & locale changing', async () => {
          const i18n = createI18n({
            allowComposition: true,
            locale: 'ja',
            messages: {
              en: {
                hello: 'hello!'
              },
              ja: {
                hello: 'こんにちは！'
              }
            }
          })

          const App = defineComponent({
            setup() {
              const { locale, t } = useI18n()
              return { locale, t }
            },
            template: `<p>{{ t('hello') }}</p>`
          })
          const { html } = await mount(App, i18n)
          expect(html()).toEqual('<p>こんにちは！</p>')

          i18n.global.locale = 'en'
          await nextTick()
          expect(html()).toEqual('<p>hello!</p>')
        })

        test('local scope', async () => {
          const i18n = createI18n({
            allowComposition: true,
            locale: 'en',
            messages: {
              en: {
                hello: 'hello!'
              },
              ja: {}
            }
          })

          const App = defineComponent({
            setup() {
              const { locale, t } = useI18n({
                useScope: 'local',
                messages: {
                  en: {
                    world: 'world!'
                  },
                  ja: {
                    world: '世界！'
                  }
                }
              })
              return { locale, t }
            },
            i18n: {},
            template: `<p>{{ locale }}:{{ t('world') }}</p>`
          })
          const { html } = await mount(App, i18n)
          expect(html()).toEqual('<p>en:world!</p>')

          i18n.global.locale = 'ja'
          await nextTick()
          expect(html()).toEqual('<p>ja:世界！</p>')
        })

        test('use custom block', async () => {
          const i18n = createI18n({
            allowComposition: true,
            locale: 'ja',
            messages: {
              en: {
                hello: 'hello!'
              },
              ja: {}
            }
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
                  locale: 'ja',
                  resource: {
                    hello: 'こんにちは!'
                  }
                }
              ]
              const { locale, t } = useI18n({
                inheritLocale: true,
                useScope: 'local'
              })
              return { locale, t }
            },
            template: `<p>{{ locale }}:{{ t('hello') }}</p>`
          })
          const { html } = await mount(App, i18n)
          expect(html()).toEqual('<p>ja:こんにちは!</p>')
        })
      })
    })

    describe('d', () => {
      test('datetime formatting', async () => {
        const i18n = createI18n({
          allowComposition: true,
          locale: 'en-US',
          fallbackLocale: ['ja-JP'],
          datetimeFormats: {
            'en-US': {
              short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/New_York'
              }
            },
            'ja-JP': {
              long: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Tokyo'
              },
              short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Tokyo'
              }
            }
          }
        })

        const App = defineComponent({
          setup() {
            const { d } = useI18n()
            const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
            return { d, dt }
          },
          template: `<p>{{ d(dt, 'long') }}</p>`
        })
        const { html } = await mount(App, i18n)
        expect(html()).toEqual('<p>2012/12/20 12:00:00</p>')
      })
    })

    describe('n', () => {
      test('number formatting', async () => {
        const i18n = createI18n({
          allowComposition: true,
          locale: 'en-US',
          fallbackLocale: ['ja-JP'],
          numberFormats: {
            'en-US': {
              currency: {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'symbol'
              },
              decimal: {
                style: 'decimal',
                useGrouping: false
              }
            },
            'ja-JP': {
              currency: {
                style: 'currency',
                currency: 'JPY' /*, currencyDisplay: 'symbol'*/
              },
              numeric: {
                style: 'decimal',
                useGrouping: false
              },
              percent: {
                style: 'percent',
                useGrouping: false
              }
            }
          }
        })

        const App = defineComponent({
          setup() {
            const { n } = useI18n()
            const value = 0.99
            return { n, value }
          },
          template: `<p>{{ n(value, { key: 'percent' }) }}</p>`
        })
        const { html } = await mount(App, i18n)
        expect(html()).toEqual('<p>99%</p>')
      })
    })
  })

  test(errorMessages[I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE], async () => {
    const randCusumerTag = `my-consumer-${randStr()}`
    const randProviderTag = `my-provider-${randStr()}`
    const Provider = defineCustomElement({
      setup() {
        createI18n<false>({ legacy: false })
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

    expect(error).toEqual(
      errorMessages[I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE]
    )
  })
})

describe('slot reactivity', () => {
  let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
  let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
  beforeEach(() => {
    org = console.warn
    spy = vi.fn()
    console.warn = spy
  })
  afterEach(() => {
    console.warn = org
  })

  test('legacy', async () => {
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
            <select v-model="$i18n.locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ $t('hello') }}</p>
        </div>
      `
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
            <select v-model="$i18n.locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ $t('hello') }}</p>
          <SubChild />
          $t inside of slot
          <SlotChild>
            {{ $t('hello') }}
          </SlotChild>
          i18n-t inside of slot
          <SlotChild>
            <i18n-t keypath='hello'/>
          </SlotChild>
        </div>
      `
    }

    const App = defineComponent({
      components: {
        Child
      },
      template: `
        <h1>Root</h1>
          <form>
            <select v-model="$i18n.locale">
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </form>
          <p>{{ $t('hello') }}</p>
        <Child />
      `
    })
    const { html } = await mount(App, i18n)
    expect(html()).toMatchSnapshot('ja')
    i18n.global.locale = 'en'
    await nextTick()
    expect(html()).toMatchSnapshot('en')
  })

  test('composable', async () => {
    const i18n = createI18n<false>({
      legacy: false,
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
            <i18n-t keypath='hello'/>
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
    const { html } = await mount(App, i18n as any) // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(html()).toMatchSnapshot('ja')
    i18n.global.locale.value = 'en'
    await nextTick()
    expect(html()).toMatchSnapshot('en')
  })
})

test('multi instance', async () => {
  const i18n1 = createI18n({
    legacy: false,
    locale: 'ja',
    messages: {
      en: {
        hello: 'hello!'
      }
    }
  })
  const i18n2 = createI18n({
    legacy: false,
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
    legacy: false,
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

describe('merge i18n custom blocks to global scope', () => {
  test('composition mode', async () => {
    const i18n = createI18n({
      legacy: false,
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

  test('legacy mode', async () => {
    const i18n = createI18n({
      legacy: true,
      locale: 'ja',
      messages: {
        en: {
          hi: { hello: 'hello!' }
        },
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    const App = defineComponent({
      __i18nGlobal: [
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
      ],
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
})

describe('custom pluralization', () => {
  test('legacy', async () => {
    const i18n = createI18n({
      locale: 'ru',
      pluralizationRules: _pluralRules,
      messages: {
        ru: {
          car: '0 машин | {n} машина | {n} машины | {n} машин'
        }
      }
    })

    const App = defineComponent({
      template: `
        <p>{{ $tc('car', 1) }}</p>
        <p>{{ $tc('car', 2) }}</p>
        <p>{{ $tc('car', 4) }}</p>
        <p>{{ $tc('car', 12) }}</p>
        <p>{{ $tc('car', 21) }}</p>
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

  test('legacy + custom block', async () => {
    const i18n = createI18n({
      locale: 'ru',
      pluralizationRules: _pluralRules
    })

    const App = defineComponent({
      __i18n: [
        {
          locale: 'ru',
          resource: {
            car: '0 машин | {n} машина | {n} машины | {n} машин'
          }
        }
      ],
      template: `
        <p>{{ $tc('car', 1) }}</p>
        <p>{{ $tc('car', 2) }}</p>
        <p>{{ $tc('car', 4) }}</p>
        <p>{{ $tc('car', 12) }}</p>
        <p>{{ $tc('car', 21) }}</p>
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

  test('composition', async () => {
    const i18n = createI18n({
      legacy: false,
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

  test('composition + custom block', async () => {
    const i18n = createI18n({
      legacy: false,
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

test('Intlify devtools hooking', () => {
  const emitter = createEmitter<IntlifyDevToolsEmitterHooks>()
  setDevToolsHook(emitter)

  const fnI18nInit = vi.fn()
  const fnTranslate = vi.fn()
  emitter.on('i18n:init', fnI18nInit)
  emitter.on('function:translate', fnTranslate)

  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello {name}!'
      }
    }
  })
  i18n.global.t('hello', { name: 'DIO' })

  expect(fnI18nInit).toHaveBeenCalled()
  expect(fnTranslate).toHaveBeenCalled()
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
        legacy: false,
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

describe('Composer & VueI18n extend hooking', () => {
  test('composition', async () => {
    const composerDisposeSpy = vi.fn()
    let counter = 0
    const composerExtendSpy = vi
      .fn()
      .mockImplementation((composer: Composer) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        counter += 1
        ;(composer as any).foo = ref(`foo${counter}`)
        return composerDisposeSpy
      })
    const vueI18nExtendSpy = vi.fn()
    const i18n = createI18n({
      legacy: false
    })

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
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    })

    // Check that global is not extended
    expect((i18n.global as any).foo).toBeUndefined() // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(html()).toBe(
      '<p></p><p class="child">foo1</p><p class="grand-child">foo2</p>'
    )
    expect(composerExtendSpy).toHaveBeenCalledTimes(2)
    expect(vueI18nExtendSpy).not.toHaveBeenCalled()

    // dispose checking
    app.unmount()
    expect(composerDisposeSpy).toHaveBeenCalledTimes(2)
  })

  test('legacy', async () => {
    const composerExtendSpy = vi.fn()
    const vueI18nDisposeSpy = vi.fn()
    let counter = 0
    const vueI18nExtendSpy = vi.fn().mockImplementation((vueI18n: VueI18n) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      counter += 1
      ;(vueI18n as any).foo = `foo${counter}`
      return vueI18nDisposeSpy
    })
    const i18n = createI18n({ legacy: true })

    const GrandChild = defineComponent({
      i18n: {
        messages: {
          en: { hello: 'hello, grand child!' }
        }
      },
      template: '<span class="grand-child">{{ $i18n.foo }}</span>'
    })

    const Child = defineComponent({
      components: {
        GrandChild
      },
      __i18n: [
        {
          locale: '',
          resource: { en: { hello: 'hello, child!' } }
        }
      ] as any,
      template: '<span class="child">{{ $i18n.foo }}</span><GrandChild />'
    })
    const App = defineComponent({
      components: {
        Child
      },
      template: '<p>{{ $i18n.foo }}</p><Child />'
    })
    const { html, app } = await mount(App, i18n, {
      pluginOptions: {
        __composerExtend: composerExtendSpy,
        __vueI18nExtend: vueI18nExtendSpy
      } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    })

    // Check that global is not extended
    expect((i18n.global as any).foo).toBeUndefined() // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(composerExtendSpy).not.toHaveBeenCalled()
    expect(vueI18nExtendSpy).toHaveBeenCalledTimes(2)
    expect(html()).toBe(
      '<p></p><span class="child">foo1</span><span class="grand-child">foo2</span>'
    )

    // dispose checking
    app.unmount()
    expect(vueI18nDisposeSpy).toHaveBeenCalledTimes(2)
  })
})

describe('dollar prefixed API (component injections)', () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  test('composition mode', async () => {
    const i18n = createI18n({
      legacy: false,
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

  test('legacy mode', async () => {
    const i18n = createI18n({
      legacy: true,
      locale: 'en',
      messages
    })
    const App = defineComponent({
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
})

test('`t` on Legacy API mode', async () => {
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
    legacy: true,
    locale: 'en',
    messages
  })

  expect(i18n.global.t('hello')).toEqual('hello world!')
  expect(i18n.global.t('list', ['world'])).toEqual('hello, world!')
  expect(i18n.global.t('named', { name: 'world' })).toEqual('hello, world!')
  expect(i18n.global.t('plural', 0)).toEqual('no apples')
  expect(i18n.global.t('plural', 1)).toEqual('one apple')
  expect(i18n.global.t('default', 'default message')).toEqual('default message')
  expect(
    i18n.global.t('default', 'default {msg}', { named: { msg: 'msg' } })
  ).toEqual('default msg')
  expect(i18n.global.t('plural', ['many'], 4)).toEqual('4 apples')
  expect(i18n.global.t('default', ['list msg'], 'default {0}')).toEqual(
    'default list msg'
  )
  expect(i18n.global.t('list', ['世界'], { locale: 'ja' })).toEqual(
    'こんにちは、世界！'
  )
  expect(i18n.global.t('plural', { count: 'many' }, 4)).toEqual('many apples')
  expect(
    i18n.global.t('default', { msg: 'named msg' }, 'default {msg}')
  ).toEqual('default named msg')
  expect(i18n.global.t('named', { name: '世界' }, { locale: 'ja' })).toEqual(
    'こんにちは、世界！'
  )
  expect(i18n.global.t('hello', {}, { locale: 'en' })).toEqual('hello world!')
  expect(i18n.global.t('hello', [], { locale: 'ja' })).toEqual(
    'こんにちは、世界！'
  )
})

test('`t` on Composition API mode', async () => {
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
    legacy: false,
    locale: 'en',
    messages
  })

  expect(i18n.global.t('hello')).toEqual('hello world!')
  expect(i18n.global.t('list', ['world'])).toEqual('hello, world!')
  expect(i18n.global.t('named', { name: 'world' })).toEqual('hello, world!')
  expect(i18n.global.t('plural', 0)).toEqual('no apples')
  expect(i18n.global.t('plural', 1)).toEqual('one apple')
  expect(i18n.global.t('default', 'default message')).toEqual('default message')
  expect(
    i18n.global.t('default', 'default {msg}', { named: { msg: 'msg' } })
  ).toEqual('default msg')
  expect(i18n.global.t('plural', ['many'], 4)).toEqual('4 apples')
  expect(i18n.global.t('default', ['list msg'], 'default {0}')).toEqual(
    'default list msg'
  )
  expect(i18n.global.t('list', ['世界'], { locale: 'ja' })).toEqual(
    'こんにちは、世界！'
  )
  expect(i18n.global.t('plural', { count: 'many' }, 4)).toEqual('many apples')
  expect(
    i18n.global.t('default', { msg: 'named msg' }, 'default {msg}')
  ).toEqual('default named msg')
  expect(i18n.global.t('named', { name: '世界' }, { locale: 'ja' })).toEqual(
    'こんにちは、世界！'
  )
  expect(i18n.global.t('hello', {}, { locale: 'en' })).toEqual('hello world!')
  expect(i18n.global.t('hello', [], { locale: 'ja' })).toEqual(
    'こんにちは、世界！'
  )
})
