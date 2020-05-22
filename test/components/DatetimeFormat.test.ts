/**
 * @jest-environment jsdom
 */

import { mount } from '../helper'
import { defineComponent } from 'vue'
import { createI18n } from '../../src/i18n'

const datetimeFormats = {
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

let org, spy
beforeEach(() => {
  org = console.warn
  spy = jest.fn()
  console.warn = spy
})
afterEach(() => {
  console.warn = org
})

test('basic usage', async () => {
  const i18n = createI18n({
    locale: 'en-US',
    datetimeFormats
  })

  const App = defineComponent({
    template: `
<i18n-d tag="p" :value="new Date()"></i18n-d>
<i18n-d tag="p" :value="new Date()" format="long"></i18n-d>
<i18n-d
  tag="p"
  :value="new Date()"
  format="long"
  locale="ja-JP-u-ca-japanese"
></i18n-d>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatch(
    /([1-9]|1[0-2])\/([1-9]|[12]\d|3[01])\/([12]\d{3})/
  )
  expect(wrapper.html()).toMatch(
    /(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/([12]\d{3}), (0[0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (AM|PM)/
  )
  expect(wrapper.html()).toMatch(
    /令和([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3][0-9])日(月|火|水|木|金|土|日)曜日 (午前|午後)([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (協定世界時|グリニッジ標準時)/
  )
})

test('slots', async () => {
  const i18n = createI18n({
    locale: 'en-US',
    datetimeFormats
  })

  const App = defineComponent({
    template: `
<i18n-d
  :value="new Date()"
  locale="ja-JP-u-ca-japanese"
  :format="{ key: 'long', era: 'narrow' }"
>
  <template #era="props"
    ><span style="color: green;">{{ props.era }}</span></template
  >
</i18n-d>
`
  })
  const wrapper = await mount(App, i18n)

  expect(wrapper.html()).toMatch(`<span style="color: green;">R</span>`)
  expect(wrapper.html()).toMatch(
    /([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3][0-9])日(月|火|水|木|金|土|日)曜日 (午前|午後)([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (協定世界時|グリニッジ標準時)/
  )
})
