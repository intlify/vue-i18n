/**
 * @jest-environment jsdom
 */

// utils
jest.mock('@intlify/shared', () => ({
  ...jest.requireActual<object>('@intlify/shared'),
  warn: jest.fn()
}))
import { warn } from '@intlify/shared'

import { ref, defineComponent } from 'vue'
import {
  setDevToolsHook,
  compileToFunction,
  registerMessageCompiler,
  resolveValue,
  registerMessageResolver,
  fallbackWithLocaleChain,
  registerLocaleFallbacker
} from '@intlify/core-base'
import { createI18n, useI18n } from '../src/i18n'
import { mount } from './helper'

const container = document.createElement('div')
document.body.appendChild(container)

beforeAll(() => {
  registerMessageCompiler(compileToFunction)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

let org: any // eslint-disable-line @typescript-eslint/no-explicit-any
let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
beforeEach(() => {
  container.innerHTML = ''

  org = console.warn
  spy = jest.fn()
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const i18n = createI18n({
      legacy: false,
      locale: 'en',
      fallbackLocale: 'en',
      globalInjection: true,
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
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

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
