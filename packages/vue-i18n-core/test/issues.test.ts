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
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue,
  setDevToolsHook
} from '@intlify/core-base'
import {
  Suspense,
  defineComponent,
  effectScope,
  h,
  nextTick,
  ref,
  resolveDirective,
  withAsyncContext,
  withDirectives
} from 'vue'
import { baseCompile } from '@intlify/message-compiler'
import { createI18n, useI18n } from '../src/i18n'
import { getCurrentInstance } from '../src/utils'
import { ast } from './fixtures/ast'
import { mount } from './helper'

import type { Component, ComponentOptions } from 'vue'
import type { I18nInternal } from '../src/i18n'
import type { IntlDateTimeFormats, IntlNumberFormats } from '../src/index'

const container = document.createElement('div')
document.body.appendChild(container)

let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
beforeEach(() => {
  registerMessageCompiler(compile)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)

  container.innerHTML = ''

  org = console.warn
  spy = vi.fn()
  console.warn = spy
})

afterEach(() => {
  setDevToolsHook(null)
  console.warn = org
})

const messages = {
  en: {
    message: {
      language: 'English',
      quantity: 'Quantity',
      list: 'hello, {0}!',
      list_multi: 'hello, {0}! Do you like {1}?',
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
  },
  'en-US': {
    named: 'hello, {name}!'
  }
}

const datetimeFormats: IntlDateTimeFormats = {
  'en-US': {
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
  },
  'ja-JP-u-ca-japanese': {
    long: {
      era: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      weekday: 'long',
      hour12: true,
      timeZoneName: 'long'
    }
  }
}

const numberFormats: IntlNumberFormats = {
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
      currency: 'JPY',
      currencyDisplay: 'symbol'
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

test('issue #708', async () => {
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

test('issue #729', async () => {
  const i18n = createI18n({
    legacy: true,
    locale: 'en',
    messages
  })

  const C3 = defineComponent({
    template: `<div>C3 slot: <slot></slot></div>`,
    i18n: {
      messages: {
        en: {
          hello: 'Hello {world} - C3',
          world: 'world! - C3'
        }
      }
    }
  })

  const C2 = defineComponent({
    template: `<div>C2 slot: <slot></slot></div>`,
    i18n: {
      messages: {
        en: {
          goodbuy: 'Goodbuy!'
        }
      }
    }
  })

  const C1 = defineComponent({
    components: {
      C2,
      C3
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
  <C3>
    <div>{{ $t("hello", { world: $t("world") }) }}</div>
    <i18n-t keypath="hello" tag="div">
      <template #world>
        <strong>{{ $t("world") }}</strong>
      </template>
    </i18n-t>
  </C3>
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
    `<div> C1: <div>Hello world!</div><div>Hello <strong>world!</strong></div><br><div>C2 slot: <div>Hello world!</div><div>Hello <strong>world!</strong></div></div><div>C3 slot: <div>Hello world!</div><div>Hello <strong>world!</strong></div></div></div>`
  )
})

test('issue #819: v-for', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
  })

  const App = defineComponent({
    setup() {
      useI18n()
      const values = ref(['kazupon', 'oranges'])
      return { values }
    },
    template: `
      <i18n-t keypath="message.list_multi" locale="en">
	<span v-for="(value, index) in values" :key="index" class="bold">
	  {{ value }}
	</span>
      </i18n-t>
      `
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `hello, <span class="bold">kazupon</span>! Do you like <span class="bold">oranges</span>?`
  )
})

describe('issue #853', () => {
  test('legacy', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
      locale: 'en',
      fallbackLocale: 'en',
      warnHtmlInMessage: 'off',
      messages: {
        en: {
          hello: '<p>hello</p>'
        }
      }
    })

    const Child = defineComponent({
      i18n: {
        messages: {
          en: { child: '<p>child</p>' }
        }
      },
      template: `<div v-html="$t('child')"></div>`
    })

    const App = defineComponent({
      components: {
        Child
      },
      template: `
        <div>
          <Child />
          <div v-html="$t('hello')"></div>
        </div>`
    })

    await mount(App, i18n)

    expect(mockWarn).toHaveBeenCalledTimes(0)
  })

  test('compostion', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      warnHtmlMessage: false,
      messages: {
        en: {
          hello: '<p>hello</p>'
        }
      }
    })

    const Child = defineComponent({
      setup() {
        const { t } = useI18n({
          messages: {
            en: { child: '<p>child</p>' }
          }
        })
        return { t }
      },
      template: `<div v-html="t('child')"></div>`
    })

    const App = defineComponent({
      components: {
        Child
      },
      template: `
        <div>
          <Child />
          <div v-html="$t('hello')"></div>
        </div>`
    })

    await mount(App, i18n)

    expect(mockWarn).toHaveBeenCalledTimes(0)
  })
})

test('issue #854', async () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mockWarn.mockImplementation(() => {})

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        hello: 'hello man!'
      }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n({
        messages: {
          en: {
            hi: 'hi!'
          }
        }
      })
      return { t }
    },
    template: `<div>{{ t('hello') }}</div>`
  })
  await mount(App, i18n)

  expect(mockWarn).toHaveBeenCalledTimes(2)
  expect(mockWarn.mock.calls[0][0]).toEqual(
    `Not found 'hello' key in 'en' locale messages.`
  )
  expect(mockWarn.mock.calls[1][0]).toEqual(
    `Fall back to translate 'hello' with root locale.`
  )
})

test('issue #933', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        hello: 'hello man!'
      }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n({
        messages: {
          en: {
            hi: 'hi! @:hello - @:local',
            local: 'local!'
          }
        }
      })
      return { t }
    },
    template: `<div>{{ t('hi') }}</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<div>hi! hello man! - local!</div>')
})

test('issue #964', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'ja',
    fallbackLocale: 'en',
    messages: {
      en: {
        hello: 'hello man!'
      }
    }
  })
  const { t } = i18n.global

  // set no compiler
  registerMessageCompiler(null as any) // eslint-disable-line @typescript-eslint/no-explicit-any

  const defaultMsg = t('foo')
  expect(defaultMsg).toEqual('foo')
  expect(t('bar', defaultMsg)).toEqual('foo')
})

test('issue #968', async () => {
  const i18n = createI18n({
    locale: 'en-GB',
    numberFormats: {
      'en-GB': {
        currency: {
          style: 'currency',
          currency: 'GBP',
          notation: 'standard',
          useGrouping: true
        }
      }
    }
  })

  const App = defineComponent({
    data() {
      return { amountFloat: parseFloat('115000120') / 100 }
    },
    template: `
  <i18n-n :value="amountFloat" format="currency">
    <template #currency="slotProps">
      <div class="col-auto text-h6">{{ slotProps.currency }}</div>
    </template>
    <template #group="slotProps">
      <div class="col-auto text-subtitle1 self-end text-amber">
        {{ slotProps.group }}
      </div>
    </template>
    <template #integer="slotProps">
      <div class="col-auto text-h3">{{ slotProps.integer }}</div>
    </template>
    <template #fraction="slotProps">
      <div class="col-auto text-subtitle1 self-end text-red">
        {{ slotProps.fraction }}
      </div>
    </template>
    <template #decimal="slotProps">
      <div class="col-auto text-subtitle2 self-end text-primary">
        {{ slotProps.decimal }}
      </div>
    </template>
  </i18n-n>
`
  })
  const wrapper = await mount(App, i18n)
  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1014', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        add_tpl: 'add',
        add_tpl_u: '@.capitalize:add_tpl'
      }
    }
  })

  const App = defineComponent({
    template: `
      <i18n-t tag="span" keypath="add_tpl_u" scope="global"></i18n-t>
    `
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1054, #1053', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    datetimeFormats: {}
  })
  const App = defineComponent({
    setup() {
      return {
        amount: 123456.789,
        format: {
          style: 'currency',
          currency: 'USD',
          signDisplay: 'always'
        }
      }
    },
    template: `
    <p>{{ $n(amount, format) }}</p>
    <i18n-n tag="span" :value="amount" :format="format" scope="global"></i18n-n>
    `
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1083', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        hello_world: 'Hello World!'
      },
      ja: {
        hello_world: 'こんにちは世界！'
      }
    }
  })

  const LanguageSelector = defineComponent({
    setup() {
      const { locale, availableLocales } = useI18n({
        useScope: 'global'
      })
      function selectLocale(newLocale: string) {
        locale.value = newLocale
      }
      return { availableLocales, selectLocale, locale }
    },
    template: `<div>
  <div :id="l" v-for="l in availableLocales" @click="selectLocale(l)">
    {{ l }}
  </div>
  <p id="locale">{{ locale }}</p>
<div>`
  })

  const HelloWorld = defineComponent({
    setup() {
      const t = resolveDirective('t')
      return () => {
        return withDirectives(h('h1', { id: 'v-t' }), [
          [t!, { path: 'hello_world' }]
        ])
      }
    }
  })

  const App = defineComponent({
    components: {
      LanguageSelector,
      HelloWorld
    },
    template: `
  <HelloWorld />
  <LanguageSelector />
`
  })

  const wrapper = await mount(App, i18n)

  const enEl = wrapper.rootEl.querySelector('#en')
  const jaEl = wrapper.rootEl.querySelector('#ja')
  const dirEl = wrapper.rootEl.querySelector('#v-t')
  expect(dirEl!.textContent).toEqual('Hello World!')

  jaEl!.dispatchEvent(new Event('click'))
  await nextTick()
  expect(dirEl!.textContent).toEqual('こんにちは世界！')

  enEl!.dispatchEvent(new Event('click'))
  await nextTick()
  expect(dirEl!.textContent).toEqual('Hello World!')
})

test('issue #1123', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
  })

  const App = defineComponent({
    setup() {
      useI18n()
      const values = ref(['kazupon', 'oranges'])
      return { values }
    },
    template: `
      <i18n-t keypath="message.list_multi" locale="en">
      <span>Hello</span>
      <a
      >
        <strong>Vue </strong>
        I18n
      </a>
      </i18n-t>
      `
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `hello, <span>Hello</span>! Do you like <a><strong>Vue </strong> I18n </a>?`
  )
})

test('issue #1365', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    flatJson: true,
    messages: {
      en: {
        'animal.dog': 'Dog',
        animal: 'Animal'
      }
    }
  })
  const App = defineComponent({
    template: `
    <p>{{ $t('animal') }}</p>
    `
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1373', async () => {
  const i18n = createI18n({
    locale: 'en-US',
    messages,
    datetimeFormats,
    numberFormats
  })

  const App = defineComponent({
    template: `
<I18nT tag="p" class="name" keypath="message.named">
  <template #name>
    <span>kazupon</span>
  </template>
</I18nT>
<I18nD tag="p" :value="new Date(1685951676578)"></I18nD>
<I18nN tag="p" :value="100" format="currency"></I18nN>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatchSnapshot()
})

test('issue #1392', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: { hello: 'world' }
    }
  })

  const Test = defineComponent({
    setup() {
      const instance = getCurrentInstance()
      if (instance == null) {
        throw new Error()
      }
      // emulate i18n custom block
      const options = instance.type as ComponentOptions
      options.__i18n = [
        {
          locale: 'en',
          resource: {
            any: 'thing'
          }
        }
      ]
      const { t } = useI18n()
      return { t }
    },
    template: `<slot />`
  })

  const App = defineComponent({
    components: {
      Test
    },
    setup() {
      const instance = getCurrentInstance()
      if (instance == null) {
        throw new Error()
      }
      // emulate i18n custom block
      const options = instance.type as ComponentOptions
      options.__i18n = [
        {
          locale: 'en',
          resource: {
            doesNotWork: 'works'
          }
        }
      ]
      const { t } = useI18n()

      return { t }
    },
    template: `<div>
  <Test>
    component: <i18n-t keypath="doesNotWork" />
    <br />
    t: {{ t('doesNotWork') }}
  </Test>
</div>`
  })

  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(`<div> component: works<br> t: works</div>`)
})

test('issue #1538', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        'my-message': {
          the_world: 'the world',
          dio: 'DIO:',
          linked: '@:my-message.dio @:my-message.the_world !!!!'
        }
      }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return { t }
    },
    template: `<div>{{ t('my-message.linked') }}</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<div>DIO: the world !!!!</div>')
})

test('issue #1547', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        product: {
          tc: {
            howToUse: {
              content1: 'Deep Linked message'
            },
            usage: {
              content2: {
                content: '@:product.tc.howToUse.content1'
              }
            }
          }
        }
      }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return { t }
    },
    template: `<div>{{ t('product.tc.usage.content2.content') }}</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual('<div>Deep Linked message</div>')
})

test('issue #1559', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello, Vue I18n',
        language: 'Languages',
        keyAndNotTranslation: {
          entry1: 'TRANSLATION FOR sub entry1',
          entry2: 'TRANSLATION FOR sub entry2'
        }
      }
    }
  })

  const App = defineComponent({
    setup() {
      const { t } = useI18n()
      return { t }
    },
    template: `
<h1>{{ t('keyAndNotTranslation.entry1') }}</h1>
  <div v-if="$te('keyAndNotTranslation')">{{ $t('keyAndNotTranslation') }}</div>`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    '<h1>TRANSLATION FOR sub entry1</h1><!--v-if-->'
  )
})

test('issue #1595', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    flatJson: true,
    messages: {
      en: {
        simple: 'Simple',
        'deep.key': 'Deep',
        content: '@:simple @:deep.key'
      }
    }
  })

  const ja = {
    simple: 'シンプル',
    'deep.key': 'ディープ',
    content: '@:simple @:deep.key'
  }
  i18n.global.setLocaleMessage('ja', ja)

  const App = defineComponent({
    setup() {
      const { t, locale } = useI18n()
      return { t, locale }
    },
    template: `<form>
  <select v-model="locale">
    <option value="en">en</option>
    <option value="ja">ja</option>
  </select>
</form>
{{ t('content') }}
`
  })

  expect(i18n.global.getLocaleMessage('ja')).toEqual({
    simple: 'シンプル',
    deep: {
      key: 'ディープ'
    },
    content: '@:simple @:deep.key'
  })

  const wrapper = await mount(App, i18n)
  expect(wrapper.html()).toEqual(
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> Simple Deep'
  )
  // @ts-ignore
  i18n.global.locale.value = 'ja'
  await nextTick()

  expect(wrapper.html()).toEqual(
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> シンプル ディープ'
  )
})

test('issue #1595 merge case', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    flatJson: true,
    messages: {
      en: {
        simple: 'Simple',
        'deep.key': 'Deep',
        content: '@:simple @:deep.key'
      },
      ja: {
        simple: 'シンプル',
        content: '@:simple @:deep.key'
      }
    }
  })

  const ja = {
    'deep.key': 'ディープ'
  }
  i18n.global.mergeLocaleMessage('ja', ja)

  const App = defineComponent({
    setup() {
      const { t, locale } = useI18n()
      return { t, locale }
    },
    template: `<form>
  <select v-model="locale">
    <option value="en">en</option>
    <option value="ja">ja</option>
  </select>
</form>
{{ $t('content') }}
`
  })

  expect(i18n.global.getLocaleMessage('ja')).toEqual({
    simple: 'シンプル',
    deep: {
      key: 'ディープ'
    },
    content: '@:simple @:deep.key'
  })

  const wrapper = await mount(App, i18n)
  expect(wrapper.html()).toEqual(
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> Simple Deep'
  )
  // @ts-ignore
  i18n.global.locale.value = 'ja'
  await nextTick()

  expect(wrapper.html()).toEqual(
    '<form><select><option value="en">en</option><option value="ja">ja</option></select></form> シンプル ディープ'
  )
})

test('issue #1610', async () => {
  const en = {
    hello: 'Hello, Vue I18n',
    language: 'Languages'
  }
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    globalInjection: true,
    messages: {
      en: {}
    }
  })

  const App = defineComponent({
    template: `
<h1>{{ $t('hello') }}</h1>
{{ $te('hello') }} (...but this should be true)
`
  })
  const wrapper = await mount(App, i18n)

  i18n.global.setLocaleMessage('en', en)
  await nextTick()

  expect(wrapper.html()).include(
    `<h1>Hello, Vue I18n</h1> true (...but this should be true)`
  )
})

test('issue #1615', async () => {
  const en = {
    hello: (() => {
      const fn = (ctx: any) => {
        const { normalize: _normalize } = ctx
        return _normalize(['Hello, Vue I18n'])
      }
      fn.source = 'Hello, Vue I18n'
      return fn
    })(),
    language: (() => {
      const fn = (ctx: any) => {
        const { normalize: _normalize } = ctx
        return _normalize(['Languages'])
      }
      fn.source = 'Languages'
      return fn
    })()
  }
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    globalInjection: true,
    messages: {
      en: {}
    }
  })

  const App = defineComponent({
    template: `
<h1>{{ $t('hello.name') }}</h1>
<p>(( "hello.name" does not exist. correct path would just be "hello")</p>
<p id="te">{{ $te('hello.name') }} (...but this should be false)</p>
`
  })
  const wrapper = await mount(App, i18n)

  i18n.global.setLocaleMessage('en', en)
  await nextTick()

  expect(wrapper.find('#te')?.textContent).toEqual(
    `false (...but this should be false)`
  )
})

test('issue #1717', async () => {
  const en = {
    'a.b.c': 'Hello, Vue I18n'
  }
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {}
    }
  })
  i18n.global.mergeLocaleMessage('en', en)
  expect(i18n.global.getLocaleMessage('en')).toEqual({
    'a.b.c': 'Hello, Vue I18n' // should not be transformed to nested object like in issue
  })
})

describe('issue #1768', () => {
  test('Implicit fallback using locales', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
      locale: 'en-US',
      fallbackLocale: 'en',
      messages: {
        en: {
          hello: {
            'vue-i18n': 'Hello, Vue I18n'
          }
        }
      }
    })

    const App = defineComponent({
      template: `<div>{{ $t('hello.vue-i18n') }}</div>`
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual('<div>Hello, Vue I18n</div>')
    expect(mockWarn).toHaveBeenCalledTimes(0)
  })

  test('Explicit fallback with decision maps', async () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockWarn.mockImplementation(() => {})

    const i18n = createI18n({
      locale: 'zh-Hant',
      fallbackLocale: {
        'de-CH': ['fr', 'it'],
        'zh-Hant': ['zh-Hans'],
        'es-CL': ['es-AR'],
        es: ['en-GB'],
        pt: ['es-AR'],
        default: ['en', 'da']
      },
      messages: {
        zh: {
          hello: {
            'vue-i18n': '你好，Vue I18n'
          }
        }
      }
    })

    const App = defineComponent({
      template: `<div>{{ $t('hello.vue-i18n') }}</div>`
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual('<div>你好，Vue I18n</div>')
    expect(mockWarn).toHaveBeenCalledTimes(0)
  })
})

test('#1796', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        hello: 'hello world',
        'message-with-placeholder-using-hyphens':
          'My message with {placeholder-hyphens}.'
      }
    }
  })
  expect(
    i18n.global.t('message-with-placeholder-using-hyphens', {
      'placeholder-hyphens': i18n.global.t('hello')
    })
  ).toEqual('My message with hello world.')
})

test('#1809', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        hi: 'hi @:名前',
        名前: 'kazupon'
      }
    }
  })
  expect(i18n.global.t('hi')).toEqual('hi kazupon')
})

test('#1912', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        hello: 'Hello, Vue I18n',
        language: 'Languages',
        apples: 'Apples',
        no_results: 'No @.lower:{0} found'
      },
      'en-variant': {
        no_results: 'No @.lower:{0} found'
      }
    }
  })

  let loc: ReturnType<typeof useI18n>['locale']
  const App = defineComponent({
    template: `
  <form>
    <select v-model="locale">
      <option value="en">en</option>
      <option value="en-variant">en-variant</option>
    </select>
  </form>
  <p>{{ t('no_results', ['apples']) }}</p>
`,
    setup() {
      const { t, locale } = useI18n()
      // @ts-ignore
      loc = locale
      return { t, locale }
    }
  })
  const wrapper = await mount(App, i18n)
  await nextTick()

  const el = wrapper.find('p')
  expect(el?.innerHTML).include(`No apples found`)
  // @ts-ignore
  loc.value = 'en-variant'
  await nextTick()

  expect(el?.innerHTML).include(`No apples found`)
})

test('#1972', () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        test: "{''} | {n} test | {n} tests"
      }
    }
  })
  expect(i18n.global.t('test', 0)).toEqual('')
})

describe('CVE-2024-52809', () => {
  function attackGetter() {
    return 'polluted'
  }

  afterEach(() => {
    // @ts-ignore -- initialize polluted property
    delete Object.prototype.static
  })

  test('success', () => {
    Object.defineProperty(Object.prototype, 'static', {
      configurable: true,
      get: attackGetter
    })
    const en = {
      hello: {
        type: 0,
        body: {
          type: 2,
          static: 'hello world',
          items: [
            {
              type: 3
            }
          ]
        }
      }
    }
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en
      }
    })
    expect(i18n.global.t('hello')).toEqual('hello world')
  })

  test('error', () => {
    Object.defineProperty(Object.prototype, 'static', {
      configurable: true,
      get: attackGetter
    })
    const en = {
      hello: {
        type: 0,
        body: {
          type: 2,
          items: [
            {
              type: 3
            }
          ]
        }
      }
    }
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: {
        en
      }
    })
    expect(() => i18n.global.t('hello')).toThrow(`unhandled node type: 3`)
  })
})

describe('#2156', () => {
  test('flatJson: false', () => {
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en: ast
      }
    })
    expect(i18n.global.t('product')).toEqual('Product')
    expect(i18n.global.t('product.type')).toEqual('Product type')
    expect(i18n.global.t('product.test.type')).toEqual('Product test type')
  })

  test('flatJson: true', () => {
    const i18n = createI18n({
      locale: 'en',
      flatJson: true,
      messages: {
        en: ast
      }
    })
    expect(i18n.global.t('product')).toEqual('Product')
    expect(i18n.global.t('product.type')).toEqual('Product type')
    expect(i18n.global.t('product.test.type')).toEqual('Product test type')
  })
})

describe('intlify/bundle-tools#498', () => {
  const toAST = (message: string) =>
    baseCompile(message, { jit: true, location: false }).ast
  const toMinifiedAST = (message: string) =>
    baseCompile(message, { jit: true, location: false, minify: true }).ast

  describe.each([
    ['message ASTs', toAST],
    ['minified message ASTs', toMinifiedAST]
  ])('flatJson with %s', (_, toMessage) => {
    test('resolves the flat keys under another message', () => {
      const i18n = createI18n({
        locale: 'en',
        flatJson: true,
        messages: {
          en: {
            'navBar.orders': toMessage('Orders'),
            'navBar.orders.buy': toMessage('Buy'),
            'navBar.orders.buy.now': toMessage('Buy now')
          }
        }
      })
      expect(i18n.global.t('navBar.orders')).toEqual('Orders')
      expect(i18n.global.t('navBar.orders.buy')).toEqual('Buy')
      expect(i18n.global.t('navBar.orders.buy.now')).toEqual('Buy now')
      expect(Object.keys(i18n.global.getLocaleMessage('en'))).toEqual([
        'navBar'
      ])
    })

    test('resolves the flat keys under another message in a nested object', () => {
      const i18n = createI18n({
        locale: 'en',
        flatJson: true,
        messages: {
          en: {
            navBar: {
              orders: toMessage('Orders'),
              'orders.buy': toMessage('Buy')
            }
          }
        }
      })
      expect(i18n.global.t('navBar.orders')).toEqual('Orders')
      expect(i18n.global.t('navBar.orders.buy')).toEqual('Buy')
    })

    test('flattens an object under another message', () => {
      const i18n = createI18n({
        locale: 'en',
        flatJson: true,
        messages: {
          en: {
            'navBar.orders': toMessage('Orders'),
            'navBar.orders.menu': { 'buy.now': toMessage('Buy now') }
          }
        }
      })
      expect(i18n.global.t('navBar.orders')).toEqual('Orders')
      expect(i18n.global.t('navBar.orders.menu.buy.now')).toEqual('Buy now')
    })

    test('keeps the flat keys that end with cacheKey', () => {
      const i18n = createI18n({
        locale: 'en',
        flatJson: true,
        messages: {
          en: {
            first: toMessage('First'),
            'first.cacheKey': toMessage('First cache key'),
            second: toMessage('Second'),
            'second.cacheKey': toMessage('Second cache key')
          }
        }
      })
      expect(i18n.global.t('first')).toEqual('First')
      expect(i18n.global.t('second')).toEqual('Second')
      expect(i18n.global.t('first.cacheKey')).toEqual('First cache key')
      expect(i18n.global.t('second.cacheKey')).toEqual('Second cache key')
    })

    test('keeps the flat keys that go through a prop key of another message', () => {
      const i18n = createI18n({
        locale: 'en',
        flatJson: true,
        messages: {
          en: {
            search: toMessage('Search'),
            'search.type.placeholder': toMessage('Type to search'),
            product: toMessage('Product'),
            'product.t.name': toMessage('Product name'),
            'field.value': toMessage('Value'),
            'field.value.value.hint': toMessage('Value hint')
          }
        }
      })
      expect(i18n.global.t('search')).toEqual('Search')
      expect(i18n.global.t('search.type.placeholder')).toEqual('Type to search')
      expect(i18n.global.t('product')).toEqual('Product')
      expect(i18n.global.t('product.t.name')).toEqual('Product name')
      expect(i18n.global.t('field.value')).toEqual('Value')
      expect(i18n.global.t('field.value.value.hint')).toEqual('Value hint')
    })

    test('keeps the flat keys that go through cacheKey of another message', () => {
      const i18n = createI18n({
        locale: 'en',
        flatJson: true,
        messages: {
          en: {
            first: toMessage('First'),
            'first.cacheKey.x': toMessage('First x')
          }
        }
      })
      expect(i18n.global.t('first')).toEqual('First')
      expect(i18n.global.t('first.cacheKey.x')).toEqual('First x')
    })
  })
})

describe('issue #2455', () => {
  test('without flatJson', async () => {
    const i18n = createI18n({
      locale: 'en',
      messages: {
        en: {
          linkedBase: 'Base',
          'linkedBase.deep': 'Deep',
          'linkedBase.deep.deeper': 'Deeper',
          testBase: 'Test: @:linkedBase',
          testDeep: 'Test: @:linkedBase.deep',
          testDeeper: 'Test: @:linkedBase.deep.deeper'
        }
      }
    })

    const App = defineComponent({
      setup() {
        const { t } = useI18n()
        return { t }
      },
      template: `<div>{{ t('testBase') }} | {{ t('testDeep') }} | {{ t('testDeeper') }}</div>`
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(
      '<div>Test: Base | Test: Deep | Test: Deeper</div>'
    )
  })

  test('with flatJson', async () => {
    const i18n = createI18n({
      locale: 'en',
      flatJson: true,
      messages: {
        en: {
          linkedBase: 'Base',
          'linkedBase.deep': 'Deep',
          'linkedBase.deep.deeper': 'Deeper',
          testBase: 'Test: @:linkedBase',
          testDeep: 'Test: @:linkedBase.deep',
          testDeeper: 'Test: @:linkedBase.deep.deeper'
        }
      }
    })

    const App = defineComponent({
      setup() {
        const { t } = useI18n()
        return { t }
      },
      template: `<div>{{ t('testBase') }} | {{ t('testDeep') }} | {{ t('testDeeper') }}</div>`
    })
    const wrapper = await mount(App, i18n)

    expect(wrapper.html()).toEqual(
      '<div>Test: Base | Test: Deep | Test: Deeper</div>'
    )
  })
})

test('#2777', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        home: 'Home',
        nextLine: 'Go to @:home\nor stay here',
        crlf: 'Go to @:home\r\nor stay here',
        tab: '@:home\tpage',
        upper: '@.upper:home\nx',
        indent: 'Go to @:home\n  stay here'
      }
    }
  })
  expect(i18n.global.t('nextLine')).toEqual('Go to Home\nor stay here')
  expect(i18n.global.t('crlf')).toEqual('Go to Home\nor stay here')
  expect(i18n.global.t('tab')).toEqual('Home\tpage')
  expect(i18n.global.t('upper')).toEqual('HOME\nx')
  expect(i18n.global.t('indent')).toEqual('Go to Home\n  stay here')
})

describe('#2795', () => {
  // Render a pending branch in <Suspense>, which the test replaces before the
  // branch resolves
  function withSuspense(branch: Component) {
    const showBranch = ref(true)
    const App = defineComponent({
      setup() {
        return () =>
          h(Suspense, null, {
            default: () =>
              showBranch.value ? h(branch) : h('p', 'Replacement'),
            fallback: () => h('p', 'Pending')
          })
      }
    })
    return { App, showBranch }
  }

  // Let the async setup() of the discarded branch run to the end
  async function flushDiscarded(promise: Promise<void>, resolve: () => void) {
    resolve()
    await promise
    await new Promise(r => setTimeout(r))
  }

  test('removes the local composer when Suspense discards a pending branch', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const { __instances } = i18n as typeof i18n & I18nInternal
    const initialSize = __instances.size
    const showChild = ref(true)
    const dispose = vi.fn()
    const { promise, resolve } = Promise.withResolvers<void>()

    const Child = defineComponent({
      __i18n: [{ locale: 'en', resource: { hello: 'Local hello' } }],
      async setup() {
        const { t } = useI18n({ useScope: 'local' })
        await promise
        return () => h('p', t('hello'))
      }
    })

    const App = defineComponent({
      setup() {
        return () =>
          h(Suspense, null, {
            default: () => (showChild.value ? h(Child) : h('p', 'Replacement')),
            fallback: () => h('p', 'Pending')
          })
      }
    })

    const wrapper = await mount(App, i18n, {
      pluginOptions: { __composerExtend: () => dispose } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    })
    expect(wrapper.html()).toBe('<p>Pending</p>')
    expect(__instances.size).toBe(initialSize + 1)

    showChild.value = false
    await nextTick()
    resolve()
    await promise
    await nextTick()

    expect(wrapper.html()).toBe('<p>Replacement</p>')
    expect(__instances.size).toBe(initialSize)
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  test('keeps the local composer after a nested scope stops until normal unmount', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const { __instances } = i18n as typeof i18n & I18nInternal
    const initialSize = __instances.size
    const showChild = ref(true)

    const Translation = defineComponent({
      setup() {
        const { t } = useI18n({ useScope: 'parent' })
        return () => h('p', t('hello'))
      }
    })
    const Child = defineComponent({
      setup() {
        const scope = effectScope()
        scope.run(() => {
          useI18n({
            useScope: 'local',
            messages: { en: { hello: 'Local hello' } }
          })
        })
        scope.stop()
        return () => h(Translation)
      }
    })
    const App = defineComponent({
      setup() {
        return () => (showChild.value ? h(Child) : null)
      }
    })

    const wrapper = await mount(App, i18n)
    expect(wrapper.html()).toBe('<p>Local hello</p>')
    expect(__instances.size).toBe(initialSize + 1)

    showChild.value = false
    await nextTick()
    expect(__instances.size).toBe(initialSize)
  })

  test('removes the local composer of a sync component in the discarded branch', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const { __instances } = i18n as typeof i18n & I18nInternal
    const initialSize = __instances.size
    const { promise, resolve } = Promise.withResolvers<void>()
    const AsyncChild = defineComponent({
      async setup() {
        await promise
        return () => h('span', 'async')
      }
    })
    const Parent = defineComponent({
      __i18n: [{ locale: 'en', resource: { hello: 'Local hello' } }],
      setup() {
        const { t } = useI18n({ useScope: 'local' })
        return () => h('div', [t('hello'), h(AsyncChild)])
      }
    })
    const { App, showBranch } = withSuspense(Parent)

    const wrapper = await mount(App, i18n)
    expect(wrapper.html()).toBe('<p>Pending</p>')
    expect(__instances.size).toBe(initialSize + 1)

    showBranch.value = false
    await nextTick()
    await flushDiscarded(promise, resolve)

    expect(wrapper.html()).toBe('<p>Replacement</p>')
    expect(__instances.size).toBe(initialSize)
  })

  test('does not keep a local composer created after the branch is discarded', async () => {
    const i18n = createI18n({ legacy: false, locale: 'en' })
    const { __instances } = i18n as typeof i18n & I18nInternal
    const initialSize = __instances.size
    const dispose = vi.fn()
    const { promise, resolve } = Promise.withResolvers<void>()
    const Child = defineComponent({
      __i18n: [{ locale: 'en', resource: { hello: 'Local hello' } }],
      async setup() {
        // what `<script setup>` compiles a top-level `await` to
        let __temp: unknown, __restore: () => void
        ;[__temp, __restore] = withAsyncContext(() => promise)
        await __temp
        __restore()
        const { t } = useI18n({ useScope: 'local' })
        return () => h('p', t('hello'))
      }
    })
    const { App, showBranch } = withSuspense(Child)

    const wrapper = await mount(App, i18n, {
      pluginOptions: { __composerExtend: () => dispose } as any // eslint-disable-line @typescript-eslint/no-explicit-any
    })
    expect(wrapper.html()).toBe('<p>Pending</p>')

    showBranch.value = false
    await nextTick()
    await flushDiscarded(promise, resolve)

    expect(wrapper.html()).toBe('<p>Replacement</p>')
    expect(__instances.size).toBe(initialSize)
    expect(dispose).toHaveBeenCalledTimes(1)
  })

  test('legacy mode: removes the VueI18n instance of a component in the discarded branch', async () => {
    const i18n = createI18n({ legacy: true, locale: 'en' })
    const { __instances } = i18n as typeof i18n & I18nInternal
    const { promise, resolve } = Promise.withResolvers<void>()
    const AsyncChild = defineComponent({
      async setup() {
        await promise
        return () => h('span', 'async')
      }
    })
    const Parent = defineComponent({
      components: { AsyncChild },
      i18n: { messages: { en: { hello: 'Local hello' } } },
      template: '<div>{{ $t("hello") }}<AsyncChild /></div>'
    })
    const { App, showBranch } = withSuspense(Parent)
    const hasParent = () =>
      [...__instances.keys()].some(instance => instance.type === Parent)

    const wrapper = await mount(App, i18n)
    expect(wrapper.html()).toBe('<p>Pending</p>')
    expect(hasParent()).toBe(true)

    showBranch.value = false
    await nextTick()
    await flushDiscarded(promise, resolve)

    expect(wrapper.html()).toBe('<p>Replacement</p>')
    expect(hasParent()).toBe(false)
  })

  test('stops the watcher of v-t in the discarded branch', async () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      messages: { en: { hello: 'hello' }, ja: { hello: 'こんにちは' } }
    })
    const forceUpdate = vi.fn()
    const { promise, resolve } = Promise.withResolvers<void>()
    const AsyncChild = defineComponent({
      async setup() {
        await promise
        return () => h('span', 'async')
      }
    })
    const Parent = defineComponent({
      setup(_, { expose }) {
        // v-t calls `$forceUpdate()` of the public instance when the locale changes
        expose({ $forceUpdate: forceUpdate })
        return () => {
          const t = resolveDirective('t')!
          return h('div', [
            withDirectives(h('p'), [[t, 'hello']]),
            h(AsyncChild)
          ])
        }
      }
    })
    const { App, showBranch } = withSuspense(Parent)

    const wrapper = await mount(App, i18n)
    expect(wrapper.html()).toBe('<p>Pending</p>')

    // v-t calls `$forceUpdate()` while the branch is pending
    i18n.global.locale.value = 'ja'
    await nextTick()
    expect(forceUpdate).toHaveBeenCalledTimes(1)

    showBranch.value = false
    await nextTick()
    await flushDiscarded(promise, resolve)
    expect(wrapper.html()).toBe('<p>Replacement</p>')

    // and no longer calls it once the branch is discarded
    i18n.global.locale.value = 'en'
    await nextTick()
    expect(forceUpdate).toHaveBeenCalledTimes(1)
  })
})
