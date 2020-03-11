import { App } from 'vue'
import { Runtime, Locale, TranslateResult, DateTimeFormatResult, NumberFormatResult } from './runtime'
import { VueI18nSymbol } from './compose'
import { Path } from './path'

export function applyPlugin (app: App, i18n: Runtime): void {
  app.provide(VueI18nSymbol, i18n)

  // supports compatibility for option style API
  app.mixin({
    beforeCreate () {
      // TODO:
      this.$i18n = i18n

      this.$t = (key: Path, ...values: unknown[]): TranslateResult => {
        // TODO:
        return key
      }

      this.$tc = (key: Path, choice?: number): TranslateResult => {
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
