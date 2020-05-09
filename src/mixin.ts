import { ComponentOptions, getCurrentInstance } from 'vue'
import { Path } from './path'
import { Locale } from './core/context'
import { Composer, ComposerInternalOptions } from './composer'
import {
  VueI18n,
  VueI18nInternal,
  createVueI18n,
  VueI18nOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from './legacy'
import { I18nInternal } from './i18n'

// supports compatibility for legacy vue-i18n APIs
export function defineMixin(
  legacy: VueI18n & VueI18nInternal,
  composer: Composer,
  i18n: I18nInternal
): ComponentOptions {
  return {
    beforeCreate() {
      const instance = getCurrentInstance()
      if (!instance) {
        // TODO:
        throw new Error('TODO')
      }

      const options = this.$options
      if (options.i18n) {
        const optionsI18n = options.i18n as VueI18nOptions &
          ComposerInternalOptions
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n
        }
        optionsI18n.__root = composer
        this.$i18n = createVueI18n(optionsI18n)

        i18n._setLegacy(instance, this.$i18n)
      } else if (options.__i18n) {
        this.$i18n = createVueI18n({
          __i18n: options.__i18n,
          __root: composer
        })

        i18n._setLegacy(instance, this.$i18n)
      } else {
        // set global
        this.$i18n = legacy
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
      const instance = getCurrentInstance()
      if (!instance) {
        // TODO:
        throw new Error('TODO')
      }

      delete this.$el.__intlify__

      delete this.$t
      delete this.$tc
      delete this.$te
      delete this.$d
      delete this.$n

      i18n._deleteLegacy(instance)
      delete this.$i18n
    }
  }
}
