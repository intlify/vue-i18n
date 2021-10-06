/**
 * @jest-environment jsdom
 */

import {
  ref,
  defineComponent,
  nextTick,
  getCurrentInstance,
  ComponentOptions
} from 'vue'
import { mount, pluralRules as _pluralRules } from './helper'
import { createI18n, useI18n } from '../src/index'
import { errorMessages, I18nErrorCodes } from '../src/errors'
import { Composer } from '../src/composer'
import { setDevToolsHook } from '@intlify/core-base'
import { createEmitter } from '@intlify/shared'

import {
  IntlifyDevToolsEmitterHooks,
  IntlifyDevToolsHooks
} from '@intlify/devtools-if'

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
    const i18n = createI18n({
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
    spy = jest.fn()
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
        ]
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
    } catch (e) {
      error = e.message
    }
    expect(error).toEqual(errorMessages[I18nErrorCodes.MUST_BE_CALL_SETUP_TOP])
  })

  test(errorMessages[I18nErrorCodes.NOT_INSLALLED], async () => {
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
        } catch (e) {
          error = e.message
        }
        return {}
      }
    })
    await mount(App, i18n, { installI18n: false })
    expect(error).toEqual(errorMessages[I18nErrorCodes.NOT_INSLALLED])
  })

  test(errorMessages[I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE], async () => {
    const i18n = createI18n({
      legacy: true,
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
          useI18n({
            locale: 'en',
            messages: {
              en: {
                hello: 'hello!'
              }
            }
          })
        } catch (e) {
          error = e.message
        }
        return {}
      },
      template: `<p>foo</p>`
    })
    await mount(App, i18n)
    expect(error).toEqual(
      errorMessages[I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE]
    )
  })
})

describe('slot reactivity', () => {
  let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
  let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
  beforeEach(() => {
    org = console.warn
    spy = jest.fn()
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
    const i18n = createI18n({
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
    const { html } = await mount(App, i18n)
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

test('merge i18n custom blocks to global scope', async () => {
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

  const fnI18nInit = jest.fn()
  const fnTranslate = jest.fn()
  emitter.on(IntlifyDevToolsHooks.I18nInit, fnI18nInit)
  emitter.on(IntlifyDevToolsHooks.FunctionTranslate, fnTranslate)

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

test('issue #708', async () => {
  const messages = {
    en: {
      message: {
        language: 'English',
        quantity: 'Quantity',
        list: 'hello, {0}!',
        named: 'hello, {name}!',
        linked: '@:message.named How are you?',
        plural: 'no bananas | {n} banana | {n} bananas'
      }
    },
    ja: {
      message: {
        language: '日本語',
        list: 'こんにちは、{0}！',
        named: 'こんにちは、{name}！',
        linked: '@:message.named ごきげんいかが？'
      }
    }
  }

  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages
  })

  const C2 = defineComponent({
    template: `<div>C2 slot: <slot></slot></div>`
  })

  const C1 = defineComponent({
    components: {
      C2
    },
    template: `<div>
  C1:
  <div>{{ $t("hello", { world: $t("world") }) }}</div>
  <i18n-t keypath="hello" tag="div">
    <template #world>
      <strong>{{ $t("world") }}</strong>
    </template>
  </i18n-t>
  <br />
  <C2>
    <div>{{ $t("hello", { world: $t("world") }) }}</div>
    <i18n-t keypath="hello" tag="div">
      <template #world>
        <strong>{{ $t("world") }}</strong>
      </template>
    </i18n-t>
  </C2>
</div>`,
    i18n: {
      messages: {
        en: {
          hello: 'Hello {world}',
          world: 'world!'
        }
      }
    }
  })

  const App = defineComponent({
    components: {
      C1
    },
    template: `<C1 />`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `<div> C1: <div>Hello world!</div><div>Hello <strong>world!</strong></div><br><div>C2 slot: <div>Hello world!</div><div>Hello <strong>world!</strong></div></div></div>`
  )
})

describe('issue #722', () => {
  test('legacy', async () => {
    const messages = {
      en: { language: 'English' },
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: true,
      locale: 'en',
      messages
    })

    const App = defineComponent({
      template: `<transition name="fade">
    <i18n-t keypath="hello" tag="p">
      <template #world>
          <b>{{ $t("world") }}</b>
      </template>
    </i18n-t>
</transition>`,
      i18n: {
        messages: {
          en: {
            hello: 'Hello {world}',
            world: 'world!'
          }
        }
      }
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(`<p>Hello <b>world!</b></p>`)
  })

  test('composition', async () => {
    const messages = {
      en: { language: 'English' },
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: false,
      globalInjection: true,
      locale: 'en',
      messages
    })

    const App = defineComponent({
      setup() {
        const { t } = useI18n({
          inheritLocale: true,
          messages: {
            en: {
              hello: 'Hello {world}',
              world: 'world!'
            }
          }
        })
        return { t }
      },
      template: `<transition name="fade">
    <i18n-t keypath="hello" tag="p">
      <template #world>
          <b>{{ t("world") }}</b>
      </template>
    </i18n-t>
</transition>`
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(`<p>Hello <b>world!</b></p>`)
  })

  test('v-if: legacy', async () => {
    const messages = {
      en: { language: 'English' },
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: true,
      locale: 'en',
      messages
    })

    const App = defineComponent({
      data() {
        return { flag: true }
      },
      template: `<div v-if="flag">
    <i18n-t keypath="hello" tag="p">
      <template #world>
          <b>{{ $t("world") }}</b>
      </template>
    </i18n-t>
</div>`,
      i18n: {
        messages: {
          en: {
            hello: 'Hello {world}',
            world: 'world!'
          }
        }
      }
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(`<div><p>Hello <b>world!</b></p></div>`)
  })

  test('v-if: composition', async () => {
    const messages = {
      en: { language: 'English' },
      ja: { language: '日本語' }
    }

    const i18n = createI18n({
      legacy: false,
      globalInjection: true,
      locale: 'en',
      messages
    })

    const App = defineComponent({
      setup() {
        const { t } = useI18n({
          inheritLocale: true,
          messages: {
            en: {
              hello: 'Hello {world}',
              world: 'world!'
            }
          }
        })
        const flag = ref(true)
        return { t, flag }
      },
      template: `<div v-if="flag">
    <i18n-t keypath="hello" tag="p">
      <template #world>
          <b>{{ t("world") }}</b>
      </template>
    </i18n-t>
</div>`,
      i18n: {
        messages: {
          en: {
            hello: 'Hello {world}',
            world: 'world!'
          }
        }
      }
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(`<div><p>Hello <b>world!</b></p></div>`)
  })
})
