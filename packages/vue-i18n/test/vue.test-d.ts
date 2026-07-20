// oxlint-disable-next-line typescript-eslint/triple-slash-reference
/// <reference path="../src/vue.d.ts" />

import type {
  ComponentCustomOptions as VueComponentCustomOptions,
  ComponentCustomProperties as VueComponentCustomProperties
} from 'vue'
import type {
  ComponentCustomOptions as VueI18nComponentCustomOptions,
  ComponentCustomProperties as VueI18nComponentCustomProperties
} from '../src/vue'

test('augments Vue components with the canonical injection types', () => {
  expectTypeOf<
    Exclude<keyof VueI18nComponentCustomOptions, keyof VueComponentCustomOptions>
  >().toEqualTypeOf<never>()
  expectTypeOf<
    Exclude<keyof VueI18nComponentCustomProperties, keyof VueComponentCustomProperties>
  >().toEqualTypeOf<never>()
  expectTypeOf<VueComponentCustomProperties['$i18n']>().toEqualTypeOf<
    VueI18nComponentCustomProperties['$i18n']
  >()
})
