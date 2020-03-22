import { App } from 'vue'
import { applyPlugin } from './plugin'
import { Path } from './path'
import { PluralizationRule, LinkedModifiers } from './context'
import { I18nComposerOptions, createI18nComposer } from './composition'
import { Locale, TranslateResult, LocaleMessages, LocaleMessageDictionary, MissingHandler } from './runtime'
import { isString, isArray, isObject } from './utils'

export type Choice = number
export type LocaleMessageObject = LocaleMessageDictionary
export type LocaleMatcher = 'lookup' | 'best-fit'
export type FormatMatcher = 'basic' | 'best-fit'
export type DateTimeHumanReadable = 'long' | 'short' | 'narrow'
export type DateTimeDigital = 'numeric' | '2-digit'

export interface SpecificDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  year?: DateTimeDigital
  month?: DateTimeDigital | DateTimeHumanReadable
  day?: DateTimeDigital
  hour?: DateTimeDigital
  minute?: DateTimeDigital
  second?: DateTimeDigital
  weekday?: DateTimeHumanReadable
  era?: DateTimeHumanReadable
  timeZoneName?: 'long' | 'short'
  localeMatcher?: LocaleMatcher
  formatMatcher?: FormatMatcher
}
export type DateTimeFormatOptions = Intl.DateTimeFormatOptions | SpecificDateTimeFormatOptions
export type DateTimeFormat = { [key: string]: DateTimeFormatOptions }
export type DateTimeFormats = { [locale: string]: DateTimeFormat }
export type DateTimeFormatResult = string
export type CurrencyDisplay = 'symbol' | 'code' | 'name'

export interface SpecificNumberFormatOptions extends Intl.NumberFormatOptions {
  style?: 'decimal' | 'percent'
  currency?: string
  currencyDisplay?: CurrencyDisplay
  localeMatcher?: LocaleMatcher
  formatMatcher?: FormatMatcher
}

export interface CurrencyNumberFormatOptions extends Intl.NumberFormatOptions {
  style: 'currency'
  currency: string // Obligatory if style is 'currency'
  currencyDisplay?: CurrencyDisplay
  localeMatcher?: LocaleMatcher
  formatMatcher?: FormatMatcher
}

export type NumberFormatOptions =
  | Intl.NumberFormatOptions
  | SpecificNumberFormatOptions
  | CurrencyNumberFormatOptions
export type NumberFormat = { [key: string]: NumberFormatOptions }
export type NumberFormats = { [locale: string]: NumberFormat }
export type NumberFormatResult = string
export type FormattedNumberPartType =
  | 'currency'
  | 'decimal'
  | 'fraction'
  | 'group'
  | 'infinity'
  | 'integer'
  | 'literal'
  | 'minusSign'
  | 'nan'
  | 'plusSign'
  | 'percentSign'

export type FormattedNumberPart = {
  type: FormattedNumberPartType
  value: string
}
export type NumberFormatToPartsResult = { [index: number]: FormattedNumberPart }

export type PluralizationRulesMap = { [locale: string]: PluralizationRule }
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'

export type IntlAvailability = {
  dateTimeFormat: boolean
  numberFormat: boolean
}

export type VueI18nOptions = {
  locale?: Locale
  fallbackLocale?: Locale
  messages?: LocaleMessages
  dateTimeFormats?: DateTimeFormats
  numberFormats?: NumberFormats
  availableLocales?: Locale[]
  modifiers?: LinkedModifiers
  missing?: MissingHandler
  fallbackRoot?: boolean
  sync?: boolean
  silentTranslationWarn?: boolean | RegExp
  silentFallbackWarn?: boolean | RegExp
  preserveDirectiveContent?: boolean
  warnHtmlInMessage?: WarnHtmlInMessageLevel
} & I18nComposerOptions

export type VueI18n = {
  // properties
  locale: Locale
  // fallbackLocale: Locale
  // readonly messages: LocaleMessages
  // readonly dateTimeFormats: DateTimeFormats
  // readonly numberFormats: NumberFormats
  /*
  missing: MissingHandler
  silentTranslationWarn: boolean | RegExp
  silentFallbackWarn: boolean | RegExp
  preserveDirectiveContent: boolean
  warnHtmlInMessage: WarnHtmlInMessageLevel
  */

  // methods
  t (key: Path, ...values: unknown[]): string
  // t (key: Path, locale: Locale, ...values: unknown[]): TranslateResult
  /*
  tc (key: Path, ...values: unknown[]): string
  tc (key: Path, choice?: Choice, locale?: Locale, ...values: unknown[]): string
  te (key: Path, locale?: Locale): boolean
  d (value: number | Date, key?: Path, locale?: Locale): DateTimeFormatResult
  d (value: number | Date, ...args: unknown[]): DateTimeFormatResult
  n (value: number, key?: Path, locale?: Locale): NumberFormatResult
  n (value: number, ...args: unknown[]): NumberFormatResult
  getLocaleMessage (locale: Locale): LocaleMessageObject
  setLocaleMessage (locale: Locale, message: LocaleMessageObject): void
  mergeLocaleMessage (locale: Locale, message: LocaleMessageObject): void
  getDateTimeFormat (locale: Locale): DateTimeFormat
  setDateTimeFormat (locale: Locale, format: DateTimeFormat): void
  mergeDateTimeFormat (locale: Locale, format: DateTimeFormat): void
  getNumberFormat (locale: Locale): NumberFormat
  setNumberFormat (locale: Locale, format: NumberFormat): void
  mergeNumberFormat (locale: Locale, format: NumberFormat): void
  // TODO:
  getChoiceIndex: (choice: Choice, choicesLength: number) => number
  */
  install (app: App): void
}

// NOTE: disable (occured build error when use rollup build ...)
// export const version = __VERSION__ // eslint-disable-line

const intlDefined = typeof Intl !== 'undefined'
export const availabilities = {
  dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== 'undefined',
  numberFormat: intlDefined && typeof Intl.NumberFormat !== 'undefined'
} as IntlAvailability

export function createI18n (options: VueI18nOptions = {}): VueI18n {
  const composer = createI18nComposer(options)

  const i18n = {
    get locale (): Locale { return composer.locale.value },
    set locale (val: Locale) { composer.locale.value = val },
    t (key: Path, ...values: unknown[]): TranslateResult {
      const [arg1, arg2] = values
      let args = values
      if (arg1 && !arg2) {
        if (isString(arg1)) {
          args = [{ locale: arg1 }]
        } else if (isArray(arg1)) {
          args = [{ list: arg1 }]
        } else if (isObject(arg1)) {
          args = [{ named: arg1 }]
        } else {
          // TODO:
        }
      } else if (arg1 && arg2) {
        if (isString(arg1) && isArray(arg2)) {
          args = [{ locale: arg1, list: arg2 }]
        } else if (isString(arg1) && isObject(arg2)) {
          args = [{ locale: arg1, named: arg2 }]
        } else {
          // TODO:
        }
      } else {
        // TODO:
      }
      return composer.t(key, ...args)
    },
    install (app: App): void {
      applyPlugin(app, i18n as VueI18n, composer)
    }
  }

  return i18n
}
