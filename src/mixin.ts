import { ComponentOptions } from 'vue'
import { Path } from './path'
import { Locale } from './core/context'
import { Composer } from './composer'
import {
  VueI18n,
  createVueI18n,
  VueI18nOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from './legacy'

// supports compatibility for legacy vue-i18n APIs
export function defineMixin(
  legacyGlobal: VueI18n,
  composer: Composer
): ComponentOptions {
  return {
    beforeCreate() {
      const options = this.$options

      if (options.i18n) {
        const optionsI18n = options.i18n as VueI18nOptions
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n
        }
        optionsI18n.__root = composer
        this.$i18n = createVueI18n(optionsI18n)
      } else if (options.__i18n) {
        this.$i18n = createVueI18n({
          __i18n: options.__i18n,
          __root: composer
        })
      } else {
        this.$i18n = legacyGlobal
      }

      // defines vue-i18n legacy APIs
      this.$t = (...args: unknown[]): TranslateResult => this.$i18n.t(...args)
      this.$tc = (...args: unknown[]): TranslateResult => this.$i18n.tc(...args)
      this.$te = (key: Path, locale?: Locale): boolean =>
        this.$i18n.te(key, locale)
      this.$d = (...args: unknown[]): DateTimeFormatResult =>
        this.$i18n.d(...args)
      this.$n = (...args: unknown[]): NumberFormatResult =>
        this.$i18n.n(...args)
    },

    mounted() {
      this.$el.__intlify__ = this.$i18n.__composer
    },

    beforeDestroy() {
      this.$el.__intlify__ = undefined
      delete this.$el.__intlify__
    }
  }
}
