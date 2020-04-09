import { ComponentPublicInstance, ComponentOptions } from 'vue'
import { Path } from './path'
import { Locale } from './runtime/context'
import { Composer } from './composer'
import {
  VueI18n,
  createVueI18n,
  VueI18nOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from './legacy'

type LegacyMixin = {
  $i18n: VueI18n
  $t(key: Path): TranslateResult
  $t(key: Path, locale: Locale): TranslateResult
  $t(key: Path, locale: Locale, list: unknown[]): TranslateResult
  $t(key: Path, locale: Locale, named: object): TranslateResult
  $t(key: Path, list: unknown[]): TranslateResult
  $t(key: Path, named: object): TranslateResult
  $tc(key: Path): TranslateResult
  $tc(key: Path, locale: Locale): TranslateResult
  $tc(key: Path, list: unknown[]): TranslateResult
  $tc(key: Path, named: object): TranslateResult
  $tc(key: Path, choice: number): TranslateResult
  $tc(key: Path, choice: number, locale: Locale): TranslateResult
  $tc(key: Path, choice: number, list: unknown[]): TranslateResult
  $tc(key: Path, choice: number, named: object): TranslateResult
  $te(key: Path, locale?: Locale): boolean
  $d(value: number | Date): DateTimeFormatResult
  $d(value: number | Date, key: string): DateTimeFormatResult
  $d(value: number | Date, key: string, locale: Locale): DateTimeFormatResult
  $d(
    value: number | Date,
    args: { [key: string]: string }
  ): DateTimeFormatResult
  $n(value: number): NumberFormatResult
  $n(value: number, key: string): NumberFormatResult
  $n(value: number, key: string, locale: Locale): NumberFormatResult
  $n(value: number, args: { [key: string]: string }): NumberFormatResult
}

// supports compatibility for vue-i18n legacy mixin
export function getMixin(
  vueI18n: VueI18n,
  composer: Composer
): ComponentOptions {
  return {
    beforeCreate(this: ComponentPublicInstance<LegacyMixin>) {
      const options = this.$options

      if (options.i18n) {
        // component local i18n
        const optionsI18n = options.i18n as VueI18nOptions
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n
        }
        optionsI18n.__root = composer
        this.$i18n = createVueI18n(optionsI18n)
      } else if (options.__i18n) {
        this.$i18n = createVueI18n({ __i18n: options.__i18n, __root: composer })
      } else if (this.$root && this.$root.proxy) {
        // root i18n
        // TODO: should resolve type inference
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instance: any = this.$root.proxy
        this.$i18n = instance.$i18n || vueI18n
      } else if (this.$parent && this.$parent.proxy) {
        // parent i18n
        // TODO: should resolve type inference
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const instance: any = this.$parent.proxy
        this.$i18n = instance.$i18n || vueI18n
      } else {
        this.$i18n = vueI18n
      }

      // define vue-i18n legacy APIs
      this.$t = (...args: unknown[]): TranslateResult => this.$i18n.t(...args)
      this.$tc = (...args: unknown[]): TranslateResult => this.$i18n.tc(...args)
      this.$te = (key: Path, locale?: Locale): boolean =>
        this.$i18n.te(key, locale)
      this.$d = (...args: unknown[]): DateTimeFormatResult =>
        this.$i18n.d(...args)
      this.$n = (...args: unknown[]): NumberFormatResult =>
        this.$i18n.n(...args)
    }
  }
}
