import { App } from 'vue'
import { Runtime, Locale, TranslateResult, DateTimeFormatResult, NumberFormatResult } from './runtime'
import { VueI18nSymbol } from './compose'
import { Path } from './path'

export type LegacyAttachedI18n<T extends unknown[]> = {
  $i18n: Runtime
  $t: (key: Path, ...values: T) => TranslateResult
  $tc: (key: Path, ...values: T) => TranslateResult
  $te: (key: Path, locale?: Locale) => boolean
  $d: (value: number | Date, ...args: T) => DateTimeFormatResult
  $n: (value: number, ...args: T) => NumberFormatResult
}

export function applyPlugin<T extends unknown[]> (app: App, i18n: Runtime): void {
  app.provide(VueI18nSymbol, i18n)

  // supports compatibility for option style API
  app.mixin({
    beforeCreate (this: LegacyAttachedI18n<T>) {
      // TODO:
      this.$i18n = i18n

      this.$t = (key: Path, ...values: T): TranslateResult => {
        // TODO:
        return key
      }

      this.$tc = (key: Path, ...values: T): TranslateResult => {
        // TODO:
        return key
      }

      this.$te = (key: Path, locale?: Locale): boolean => {
        // TODO:
        return true
      }

      this.$d = (value: number | Date, ...args: T): DateTimeFormatResult => {
        // TODO:
        return {} as DateTimeFormatResult
      }

      this.$n = (value: number, ...args: T): NumberFormatResult => {
        // TODO:
        return {} as NumberFormatResult
      }
    }
  })
}
