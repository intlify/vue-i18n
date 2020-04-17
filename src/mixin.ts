import {
  App,
  getCurrentInstance,
  ComponentInternalInstance,
  ComponentPublicInstance,
  ComponentOptions
} from 'vue'
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

const legacyInstances = new Map<ComponentInternalInstance, VueI18n>()

function getLegacyInstance(
  key: ComponentInternalInstance | null,
  legacyDefault: VueI18n
): VueI18n {
  return key ? legacyInstances.get(key) || legacyDefault : legacyDefault
}

// supports compatibility for legacy vue-i18n APIs
export function defineMixin(
  app: App,
  legacyGlobal: VueI18n,
  composer: Composer
): ComponentOptions {
  // inject Legacy APIs
  Object.defineProperty(app.config.globalProperties, '$i18n', {
    get: () => {
      const instance = getCurrentInstance()
      return instance
        ? legacyInstances.get(instance) || legacyGlobal
        : legacyGlobal
    }
  })

  Object.defineProperty(app.config.globalProperties, '$t', {
    value: (...args: unknown[]): TranslateResult => {
      const vueI18n = getLegacyInstance(getCurrentInstance(), legacyGlobal)
      return vueI18n.t(...args)
    }
  })

  Object.defineProperty(app.config.globalProperties, '$tc', {
    value: (...args: unknown[]): TranslateResult => {
      const vueI18n = getLegacyInstance(getCurrentInstance(), legacyGlobal)
      return vueI18n.tc(...args)
    }
  })

  Object.defineProperty(app.config.globalProperties, '$te', {
    value: (key: Path, locale?: Locale): boolean => {
      const vueI18n = getLegacyInstance(getCurrentInstance(), legacyGlobal)
      return vueI18n.te(key, locale)
    }
  })

  Object.defineProperty(app.config.globalProperties, '$d', {
    value: (...args: unknown[]): DateTimeFormatResult => {
      const vueI18n = getLegacyInstance(getCurrentInstance(), legacyGlobal)
      return vueI18n.d(...args)
    }
  })

  Object.defineProperty(app.config.globalProperties, '$n', {
    value: (...args: unknown[]): NumberFormatResult => {
      const vueI18n = getLegacyInstance(getCurrentInstance(), legacyGlobal)
      return vueI18n.n(...args)
    }
  })

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
        const instance = getCurrentInstance()
        if (instance) {
          legacyInstances.set(instance, createVueI18n(optionsI18n))
        }
      } else if (options.__i18n) {
        const instance = getCurrentInstance()
        if (instance) {
          legacyInstances.set(
            instance,
            createVueI18n({
              __i18n: options.__i18n,
              __root: composer
            })
          )
        }
      }
    }
  }
}
