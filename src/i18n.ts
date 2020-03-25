import { App } from 'vue'
import { applyPlugin } from './plugin'
import { Path } from './path'
import { PluralizationRule, LinkedModifiers } from './context'
import { Locale, LocaleMessages, LocaleMessageDictionary } from './runtime/context'
import { TranslateOptions } from './runtime/localize'
import { DateTimeFormats } from './runtime/datetime'
import { NumberFormats } from './runtime/number'
import { MissingHandler, I18nComposer, I18nComposerOptions, createI18nComposer } from './composition'
import { isString, isArray, isObject, isNumber } from './utils'

export type TranslateResult = string
export type Choice = number
export type LocaleMessageObject = LocaleMessageDictionary
export type PluralizationRulesMap = { [locale: string]: PluralizationRule }
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'
export type DateTimeFormatResult = string
export type NumberFormatResult = string

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
  sharedMessages?: LocaleMessages
  pluralRule?: PluralizationRule // breaking change for Vue 3
  __i18n?: LocaleMessages // for custom blocks
}

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
  t (key: Path, ...values: unknown[]): TranslateResult // return value is breaking change for Vue 3
  tc (key: Path, ...values: unknown[]): TranslateResult // return value is breaking change for Vue 3
  /*
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

function convertI18nComposerOptions (options: VueI18nOptions): I18nComposerOptions {
  const locale = options.locale
  const fallbackLocales = options.fallbackLocale ? [options.fallbackLocale] : []
  const missing = options.missing
  const missingWarn = options.silentTranslationWarn === undefined
    ? true
    : !options.silentTranslationWarn
  const fallbackWarn = options.silentFallbackWarn === undefined
    ? true
    : !options.silentFallbackWarn
  const fallbackRoot = options.fallbackRoot
  const pluralRule = options.pluralRule

  let messages = options.messages

  // TODO: should be merged locale messages of custom block
  //

  if (isObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages
    const locales: Locale[] = Object.keys(sharedMessages)
    messages = locales.reduce((messages, locale) => {
      const message = messages[locale] || { [locale]: {} }
      Object.assign(message, sharedMessages[locale])
      return messages
    }, messages || {})
  }

  return {
    locale,
    fallbackLocales,
    messages,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackRoot,
    pluralRule
  }
}

export function createI18n (options: VueI18nOptions = {}, root?: I18nComposer): VueI18n {
  const composer = createI18nComposer(convertI18nComposerOptions(options), root)

  const i18n = {
    get locale (): Locale { return composer.locale.value },
    set locale (val: Locale) { composer.locale.value = val },
    t (key: Path, ...values: unknown[]): TranslateResult {
      // TODO: should be more refactored ...
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
    tc (key: Path, ...values: unknown[]): TranslateResult {
      const [arg1, arg2, arg3] = values
      const options = {} as TranslateOptions

      if (isNumber(arg1)) {
        options.plural = arg1
      }

      if (isString(arg2)) {
        options.locale = arg2
      } else if (isArray(arg2)) {
        options.list = arg2
      } else if (isObject(arg2)) {
        options.named = arg2
      }

      if (isArray(arg3)) {
        options.list = arg3
      } else if (isObject(arg3)) {
        options.named = arg3
      }

      return composer.t(key, ...(values.length > 0 ? [options] : []))
    },
    install (app: App): void {
      applyPlugin(app, i18n as VueI18n, composer)
    }
  }

  return i18n
}
