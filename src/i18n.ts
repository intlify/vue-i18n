import { App } from 'vue'
import { applyPlugin } from './plugin'
import { Path } from './path'
import { PluralizationRule, PluralizationRules, LinkedModifiers } from './message/context'
import {
  Locale,
  LocaleMessages,
  LocaleMessage,
  LocaleMessageDictionary,
  PostTranslationHandler
} from './runtime/context'
import { TranslateOptions } from './runtime/localize'
import { DateTimeFormats } from './runtime/datetime'
import { NumberFormats } from './runtime/number'
import { MissingHandler, I18nComposer, I18nComposerOptions, createI18nComposer } from './composition'
import { isString, isArray, isObject, isNumber, warn, isBoolean, isFunction, isRegExp } from './utils'

export type TranslateResult = string
export type Choice = number
export type LocaleMessageObject = LocaleMessageDictionary
export type PluralizationRulesMap = { [locale: string]: PluralizationRule }
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'
export type DateTimeFormatResult = string
export type NumberFormatResult = string
export interface Formatter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolate (message: string, values: any, path: string): (Array<any> | null)
}

export type VueI18nOptions = {
  locale?: Locale
  fallbackLocale?: Locale
  messages?: LocaleMessages
  dateTimeFormats?: DateTimeFormats
  numberFormats?: NumberFormats
  availableLocales?: Locale[]
  modifiers?: LinkedModifiers
  formatter?: Formatter
  missing?: MissingHandler
  fallbackRoot?: boolean
  sync?: boolean
  silentTranslationWarn?: boolean | RegExp
  silentFallbackWarn?: boolean | RegExp
  formatFallbackMessages?: boolean
  preserveDirectiveContent?: boolean
  warnHtmlInMessage?: WarnHtmlInMessageLevel
  sharedMessages?: LocaleMessages
  pluralizationRules?: PluralizationRules // breaking change for Vue 3
  postTranslation?: PostTranslationHandler
  __i18n?: LocaleMessages // for custom blocks
}

export type VueI18n = {
  // properties
  locale: Locale
  fallbackLocale: Locale
  readonly availableLocales: Locale[]
  readonly messages: LocaleMessages
  formatter: Formatter
  missing?: MissingHandler
  postTranslation: PostTranslationHandler | null
  silentTranslationWarn: boolean | RegExp
  silentFallbackWarn: boolean | RegExp
  formatFallbackMessages: boolean
  // readonly dateTimeFormats: DateTimeFormats
  // readonly numberFormats: NumberFormats
  /*
  preserveDirectiveContent: boolean
  warnHtmlInMessage: WarnHtmlInMessageLevel
  */

  // methods
  t (key: Path, ...values: unknown[]): TranslateResult // return value is breaking change for Vue 3
  tc (key: Path, ...values: unknown[]): TranslateResult // return value is breaking change for Vue 3
  getLocaleMessage (locale: Locale): LocaleMessage
  setLocaleMessage (locale: Locale, message: LocaleMessage): void
  mergeLocaleMessage (locale: Locale, message: LocaleMessage): void
  /*
  te (key: Path, locale?: Locale): boolean
  d (value: number | Date, key?: Path, locale?: Locale): DateTimeFormatResult
  d (value: number | Date, ...args: unknown[]): DateTimeFormatResult
  n (value: number, key?: Path, locale?: Locale): NumberFormatResult
  n (value: number, ...args: unknown[]): NumberFormatResult
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
  const locale = isString(options.locale) ? options.locale : 'en-US'
  const fallbackLocales = isString(options.fallbackLocale) ? [options.fallbackLocale] : []
  const missing = options.missing
  const missingWarn = isBoolean(options.silentTranslationWarn) || isRegExp(options.silentTranslationWarn)
    ? options.silentTranslationWarn
    : true
  const fallbackWarn = isBoolean(options.silentFallbackWarn) || isRegExp(options.silentFallbackWarn)
    ? options.silentFallbackWarn
    : true
  const fallbackRoot = isBoolean(options.fallbackRoot) ? options.fallbackRoot : true
  const fallbackFormat = isBoolean(options.formatFallbackMessages)
    ? options.formatFallbackMessages
    : false
  const pluralizationRules = options.pluralizationRules
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : undefined

  if (__DEV__ && options.formatter) {
    warn(`not supportted 'formatter' option`)
  }

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
    fallbackFormat,
    pluralRules: pluralizationRules,
    postTranslation
  }
}

export function createI18n (options: VueI18nOptions = {}, root?: I18nComposer): VueI18n {
  const composer = createI18nComposer(convertI18nComposerOptions(options), root)

  const i18n = {
    /* properties */
    // locale
    get locale (): Locale { return composer.locale.value },
    set locale (val: Locale) { composer.locale.value = val },
    // fallbackLocale
    get fallbackLocale (): Locale {
      return composer.fallbackLocales.value.length === 0
        ? 'en-US' // compatible for vue-i18n legay style
        : composer.fallbackLocales.value[0]
    },
    set fallbackLocale (val: Locale) { composer.fallbackLocales.value = [val] },
    // messages
    get messages (): LocaleMessages { return composer.messages.value },
    // availableLocales
    get availableLocales (): Locale[] { return composer.availableLocales },
    // formatter
    get formatter (): Formatter {
      __DEV__ && warn(`not support 'formatter' property`)
      return { interpolate () { return [] } }
    },
    set formatter (val: Formatter) {
      __DEV__ && warn(`not support 'formatter' property`)
    },
    // missing
    get missing (): MissingHandler | undefined { return composer.getMissingHandler() },
    set missing (val: MissingHandler | undefined) { val && composer.setMissingHandler(val) },
    // silentTranslationWarn
    get silentTranslationWarn (): boolean | RegExp {
      return isBoolean(composer.missingWarn)
        ? !composer.missingWarn
        : composer.missingWarn
    },
    set silentTranslationWarn (val: boolean | RegExp) { composer.missingWarn = isBoolean(val) ? !val : val },
    // silentFallbackWarn
    get silentFallbackWarn (): boolean | RegExp {
      return isBoolean(composer.fallbackWarn)
        ? !composer.fallbackWarn
        : composer.fallbackWarn
    },
    set silentFallbackWarn (val: boolean | RegExp) { composer.fallbackWarn = isBoolean(val) ? !val : val },
    // formatFallbackMessages
    get formatFallbackMessages (): boolean { return composer.fallbackFormat },
    set formatFallbackMessages (val: boolean) { composer.fallbackFormat = val },
    // postTranslation
    get postTranslation (): PostTranslationHandler | null { return composer.getPostTranslationHandler() },
    set postTranslation (handler: PostTranslationHandler | null) { composer.setPostTranslationHandler(handler) },
    /* methods */
    t (key: Path, ...values: unknown[]): TranslateResult {
      const [arg1, arg2] = values
      const options = {} as TranslateOptions

      if (isString(arg1)) {
        options.locale = arg1
      } else if (isArray(arg1)) {
        options.list = arg1
      } else if (isObject(arg1)) {
        options.named = arg1
      }

      if (isArray(arg2)) {
        options.list = arg2
      } else if (isObject(arg2)) {
        options.named = arg2
      }

      return composer.t(key, ...(values.length > 0 ? [options] : []))
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
    getLocaleMessage (locale: Locale): LocaleMessage { return composer.getLocaleMessage(locale) },
    setLocaleMessage (locale: Locale, message: LocaleMessage): void {
      composer.setLocaleMessage(locale, message)
    },
    mergeLocaleMessage (locale: Locale, message: LocaleMessage): void {
      composer.mergeLocaleMessage(locale, message)
    },
    install (app: App): void {
      applyPlugin(app, i18n as VueI18n, composer)
    }
  }

  return i18n
}
