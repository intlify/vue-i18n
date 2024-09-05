/**
 * @vitest-environment jsdom
 */

import {
  compile,
  fallbackWithLocaleChain,
  registerLocaleFallbacker,
  registerMessageCompiler,
  registerMessageResolver,
  resolveValue
} from '@intlify/core-base'
import { defineComponent, h, SetupContext, VNodeChild } from 'vue'
import { createI18n } from '../../src/index'
import { mount } from '../helper'

import type { IntlNumberFormats } from '../../src/index'

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

beforeAll(() => {
  registerMessageCompiler(compile)
  registerMessageResolver(resolveValue)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

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

test('basic usage', async () => {
  const i18n = createI18n({
    locale: 'en-US',
    numberFormats
  })

  const App = defineComponent({
    template: `
<i18n-n tag="p" :value="100"></i18n-n>
<i18n-n tag="p" :value="100" format="currency"></i18n-n>
<i18n-n tag="p" :value="100" format="currency" locale="ja-JP"></i18n-n>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(`<p>100</p><p>$100.00</p><p>￥100</p>`)
})

test('slots', async () => {
  const i18n = createI18n({
    locale: 'en-US',
    numberFormats
  })

  const App = defineComponent({
    template: `
<i18n-n :value="1234" :format="{ key: 'currency', currency: 'EUR' }">
  <template #currency="props"
    ><span style="color: green;">{{ props.currency }}</span></template
  >
  <template #integer="props"
    ><span style="font-weight: bold;">{{ props.integer }}</span></template
  >
  <template #group="props"
    ><span style="font-weight: bold;">{{ props.group }}</span></template
  >
  <template #fraction="props"
    ><span style="font-size: small;">{{ props.fraction }}</span></template
  >
</i18n-n>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `<span style=\"color: green;\">€</span><span style=\"font-weight: bold;\">1</span><span style=\"font-weight: bold;\">,</span><span style=\"font-weight: bold;\">234</span>.<span style=\"font-size: small;\">00</span>`
  )
})

test('component', async () => {
  const i18n = createI18n({
    locale: 'en-US',
    numberFormats
  })

  const MyComponent = defineComponent({
    setup(props, context: SetupContext) {
      return (): VNodeChild => h('span', context.slots.default!())
    }
  })

  const App = defineComponent({
    data: () => ({ MyComponent }),
    template: `
<i18n-n :tag="MyComponent" :value="100"></i18n-n>
<i18n-n :tag="MyComponent" :value="100" format="currency"></i18n-n>
<i18n-n :tag="MyComponent" :value="100" format="currency" locale="ja-JP"></i18n-n>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toEqual(
    `<span>100</span><span>$100.00</span><span>￥100</span>`
  )
})
