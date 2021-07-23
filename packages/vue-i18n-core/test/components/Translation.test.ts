/**
 * @jest-environment jsdom
 */

import { mount } from '../helper'
import { h, defineComponent, SetupContext, VNodeChild, ref } from 'vue'
import {
  compileToFunction,
  registerMessageCompiler,
  resolveValue,
  registerMessageResolver,
  fallbackWithLocaleChain,
  registerLocaleFallbacker
} from '@intlify/core-base'
import { createI18n, useI18n } from '../../src/index'

import type { Path, PathValue, MessageResolver } from '@intlify/core-base'

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

beforeAll(() => {
  registerMessageCompiler(compileToFunction)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

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

test('slot contents', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages
  })

  const App = defineComponent({
    template: `
<i18n-t tag="p" class="name" keypath="message.named">
  <template #name>
    <span>kazupon</span>
  </template>
</i18n-t>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `<p class="name">hello, <span>kazupon</span>!</p>`
  )
})

test('DOM contents', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
  })

  const App = defineComponent({
    setup() {
      return { ...useI18n() }
    },
    template: `
<i18n-t keypath="message.list" locale="en">
  <span class="lang">
    {{ t('message.language', {}, { locale: 'en' }) }}
  </span>
</i18n-t>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(`hello, <span class="lang">English</span>!`)
})

test('linked contents', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
  })

  const App = defineComponent({
    setup() {
      return { ...useI18n() }
    },
    template: `
<i18n-t keypath="message.linked">
  <template #name>
    <span>かずぽん</span>
  </template>
</i18n-t>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(`hello, <span>かずぽん</span>! How are you?`)
})

test('plural contents', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages
  })

  const App = defineComponent({
    setup() {
      const count = ref(2)
      return { ...useI18n(), count }
    },
    template: `
<i18n-t keypath="message.plural" locale="en" :plural="count">
  <template #n>
    <b>{{ count }}</b>
  </template>
</i18n-t>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(`<b>2</b> bananas`)
})

test('scope', async () => {
  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        global: 'this is global'
      }
    }
  })

  const Child = defineComponent({
    template: `
<i18n-t keypath="global" scope="global">
  <p>Child</p>
</i18n-t>
`
  })

  const Container = defineComponent({
    components: {
      Child
    },
    template: `
<i18n-t keypath="root">
  <p>Container</p>
</i18n-t>
<Child>
`
  })

  const Root = defineComponent({
    components: {
      Container
    },
    setup() {
      return {
        ...useI18n({
          locale: 'en',
          messages: {
            en: {
              root: 'this is root'
            }
          }
        })
      }
    },
    template: `<Container>`
  })

  const wrapper = await mount(Root, i18n)

  expect(wrapper.html()).toEqual(`this is rootthis is global`)
})

test('component', async () => {
  const i18n = createI18n({
    locale: 'en',
    messages
  })

  const MyComponent = defineComponent({
    setup(props, context: SetupContext) {
      return (): VNodeChild => h('p', context.slots.default!())
    }
  })

  const App = defineComponent({
    data: () => ({ MyComponent }),
    template: `
<i18n-t :tag="MyComponent" class="name" keypath="message.named">
  <template #name>
    <span>kazupon</span>
  </template>
</i18n-t>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `<p class="name">hello, <span>kazupon</span>!</p>`
  )
})

test('message resolver', async () => {
  const fn = jest.fn()
  const mockMessageResolver = fn as jest.MockedFunction<MessageResolver>
  mockMessageResolver.mockImplementation(
    (obj: unknown, path: Path): PathValue => {
      const msg = (obj as any)[path] // eslint-disable-line @typescript-eslint/no-explicit-any
      return msg != null ? msg : null
    }
  )
  const en = {
    'message.named': 'hello, {name}!'
  }
  const i18n = createI18n({
    locale: 'en',
    messageResolver: fn,
    messages: { en }
  })

  const MyComponent = defineComponent({
    setup(props, context: SetupContext) {
      return (): VNodeChild => h('p', context.slots.default!())
    }
  })

  const App = defineComponent({
    data: () => ({ MyComponent }),
    template: `
<i18n-t :tag="MyComponent" class="name" keypath="message.named">
  <template #name>
    <span>kazupon</span>
  </template>
</i18n-t>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `<p class="name">hello, <span>kazupon</span>!</p>`
  )
  expect(mockMessageResolver).toHaveBeenCalledTimes(1)
  expect(mockMessageResolver.mock.calls[0][0]).toEqual(en)
  expect(mockMessageResolver.mock.calls[0][1]).toEqual('message.named')
})
