import { App, ComponentPublicInstance, FunctionDirective } from 'vue'
import { Path } from './path'
import { Locale, TranslateResult } from './runtime'
import { GlobalI18nSymbol, I18nComposer } from './composition'
import { VueI18n, createI18n, VueI18nOptions, DateTimeFormatResult, NumberFormatResult } from './i18n'
import { Interpolate, Number } from './components'
import { hook as vT } from './directive'

export type LegacyVueI18n = {
  $i18n: VueI18n
  $t: (key: Path, ...values: unknown[]) => TranslateResult
  $tc: (key: Path, ...values: unknown[]) => TranslateResult
  $te: (key: Path, locale?: Locale) => boolean
  $d: (value: number | Date, ...args: unknown[]) => DateTimeFormatResult
  $n: (value: number, ...args: unknown[]) => NumberFormatResult
}

export function applyPlugin (app: App, legacyI18n: VueI18n, composer: I18nComposer): void {
  // install components
  app.component(Interpolate.name, Interpolate)
  app.component(Number.name, Number)

  // install directive
  app.directive('t', vT as FunctionDirective) // TODO:

  // setup global provider
  app.provide(GlobalI18nSymbol, composer)

  // supports compatibility for vue-i18n old style API
  app.mixin({
    beforeCreate (this: ComponentPublicInstance<LegacyVueI18n>) {
      // TODO: should resolve type inference
      const options: any = this.$options

      if (options.i18n) { // component local i18n
        const optionsI18n = options.i18n as VueI18nOptions

        // TODO: should be inherited parent options here !
        // e.g optionsI18n.fallbackLocale = this.$root.proxy.$i18n.fallbackLocale
        /*
        if (this.$root && this.$root.proxy && this.$root.proxy.$i18n) {
          options.i18n.root = this.$root
          options.i18n.formatter = this.$root.$i18n.formatter
          options.i18n.fallbackLocale = this.$root.$i18n.fallbackLocale
          options.i18n.formatFallbackMessages = this.$root.$i18n.formatFallbackMessages
          options.i18n.silentTranslationWarn = this.$root.$i18n.silentTranslationWarn
          options.i18n.silentFallbackWarn = this.$root.$i18n.silentFallbackWarn
          options.i18n.pluralizationRules = this.$root.$i18n.pluralizationRules
          options.i18n.preserveDirectiveContent = this.$root.$i18n.preserveDirectiveContent
        }
        */

        // TODO: should be merged locale messages from custom blocks
        /*
        // init locale messages via custom blocks
        if (options.__i18n) {
          try {
            let localeMessages = {}
            options.__i18n.forEach(resource => {
              localeMessages = merge(localeMessages, JSON.parse(resource))
            })
            options.i18n.messages = localeMessages
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              warn(`Cannot parse locale messages via custom blocks.`, e)
            }
          }
        }
        */

        // TODO: should be merged sharedMessages
        /*
        const { sharedMessages } = options.i18n
        if (sharedMessages && isPlainObject(sharedMessages)) {
          options.i18n.messages = merge(options.i18n.messages, sharedMessages)
        }
        */
        this.$i18n = createI18n(optionsI18n)
      } else if (this.$root && this.$root.proxy) { // root i18n
        // TODO: should resolve type inference
        const instance: any = this.$root.proxy
        this.$i18n = instance.$i18n || legacyI18n
      } else if (this.$parent && this.$parent.proxy) { // parent i18n
        // TODO: should resolve type inference
        const instance: any = this.$parent.proxy
        this.$i18n = instance.$i18n || legacyI18n
      } else {
        this.$i18n = legacyI18n
      }

      this.$t = (key: Path, ...values: unknown[]): TranslateResult => {
        // TODO:
        return key
      }

      this.$tc = (key: Path, ...values: unknown[]): TranslateResult => {
        // TODO:
        return key
      }

      this.$te = (key: Path, locale?: Locale): boolean => {
        // TODO:
        return true
      }

      this.$d = (value: number | Date, ...args: unknown[]): DateTimeFormatResult => {
        // TODO:
        return {} as DateTimeFormatResult
      }

      this.$n = (value: number, ...args: unknown[]): NumberFormatResult => {
        // TODO:
        return {} as NumberFormatResult
      }
    }
  })
}
