import { App, FunctionDirective } from 'vue'
import { Path } from './path'
import { Locale, TranslateResult } from './runtime'
import { GlobalI18nSymbol, I18nComposer } from './composition'
import { VueI18n, DateTimeFormatResult, NumberFormatResult } from './i18n'
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

  // supports compatibility for option style API
  app.mixin({
    beforeCreate (this: LegacyVueI18n) {
      // TODO:
      this.$i18n = legacyI18n

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
