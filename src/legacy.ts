/**
 *  Legacy
 *
 *  This module is offered legacy vue-i18n API compatibility
 */

import { App, Plugin } from 'vue'
import { apply } from './plugin'
import { getMixin } from './mixin'
import { Path, resolveValue } from './path'
import {
  PluralizationRule,
  PluralizationRules,
  LinkedModifiers,
  NamedValue
} from './message/context'
import {
  Locale,
  LocaleMessages,
  LocaleMessage,
  LocaleMessageDictionary,
  PostTranslationHandler
} from './runtime/context'
import { TranslateOptions } from './runtime/translate'
import {
  DateTimeFormats,
  NumberFormats,
  DateTimeFormat,
  NumberFormat
} from './runtime/types'
import {
  MissingHandler,
  CustomBlocks,
  Composer,
  ComposerOptions,
  createComposer
} from './composer'
import {
  isString,
  isArray,
  isPlainObject,
  isNumber,
  isBoolean,
  isFunction,
  isRegExp,
  warn
} from './utils'

export type TranslateResult = string
export type Choice = number
export type LocaleMessageObject = LocaleMessageDictionary
export type PluralizationRulesMap = { [locale: string]: PluralizationRule }
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'
export type DateTimeFormatResult = string
export type NumberFormatResult = string
export interface Formatter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolate(message: string, values: any, path: string): Array<any> | null
}

/**
 *  VueI18n Options
 *
 *  This option type is compatible with the constructor options of `VueI18n` class (offered with vue-i18n@8.x).
 */
export type VueI18nOptions = {
  locale?: Locale
  fallbackLocale?: Locale
  messages?: LocaleMessages
  datetimeFormats?: DateTimeFormats
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
  pluralizationRules?: PluralizationRules
  postTranslation?: PostTranslationHandler
  __i18n?: CustomBlocks // for custom blocks, and internal
  _root?: Composer // for internal
}

/**
 *  VueI18n Interfaces
 *
 *  This type is compatible with interface of `VueI18n` class (offered with vue-i18n@8.x).
 */
export type VueI18n = {
  /**
   * properties
   */
  locale: Locale
  fallbackLocale: Locale
  readonly availableLocales: Locale[]
  readonly messages: LocaleMessages
  readonly datetimeFormats: DateTimeFormats
  readonly numberFormats: NumberFormats
  formatter: Formatter
  missing: MissingHandler | null
  postTranslation: PostTranslationHandler | null
  silentTranslationWarn: boolean | RegExp
  silentFallbackWarn: boolean | RegExp
  formatFallbackMessages: boolean
  /*
  preserveDirectiveContent: boolean
  warnHtmlInMessage: WarnHtmlInMessageLevel
  */

  /**
   * methods
   */
  t(key: Path): TranslateResult
  t(key: Path, locale: Locale): TranslateResult
  t(key: Path, locale: Locale, list: unknown[]): TranslateResult
  t(key: Path, locale: Locale, named: object): TranslateResult
  t(key: Path, list: unknown[]): TranslateResult
  t(key: Path, named: object): TranslateResult
  t(...args: unknown[]): TranslateResult // for $t
  tc(key: Path): TranslateResult
  tc(key: Path, locale: Locale): TranslateResult
  tc(key: Path, list: unknown[]): TranslateResult
  tc(key: Path, named: object): TranslateResult
  tc(key: Path, choice: number): TranslateResult
  tc(key: Path, choice: number, locale: Locale): TranslateResult
  tc(key: Path, choice: number, list: unknown[]): TranslateResult
  tc(key: Path, choice: number, named: object): TranslateResult
  tc(...args: unknown[]): TranslateResult // for $tc
  te(key: Path, locale?: Locale): boolean
  getLocaleMessage(locale: Locale): LocaleMessage
  setLocaleMessage(locale: Locale, message: LocaleMessage): void
  mergeLocaleMessage(locale: Locale, message: LocaleMessage): void
  d(value: number | Date): DateTimeFormatResult
  d(value: number | Date, key: string): DateTimeFormatResult
  d(value: number | Date, key: string, locale: Locale): DateTimeFormatResult
  d(value: number | Date, args: { [key: string]: string }): DateTimeFormatResult
  d(...args: unknown[]): DateTimeFormatResult // for $d
  getDateTimeFormat(locale: Locale): DateTimeFormat
  setDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  n(value: number): NumberFormatResult
  n(value: number, key: string): NumberFormatResult
  n(value: number, key: string, locale: Locale): NumberFormatResult
  n(value: number, args: { [key: string]: string }): NumberFormatResult
  n(...args: unknown[]): NumberFormatResult // for $n
  getNumberFormat(locale: Locale): NumberFormat
  setNumberFormat(locale: Locale, format: NumberFormat): void
  mergeNumberFormat(locale: Locale, format: NumberFormat): void
  getChoiceIndex: (choice: Choice, choicesLength: number) => number
  install: Plugin
}

/**
 *  Convert to I18n Composer Options from VueI18n Options
 */
function convertComposerOptions(options: VueI18nOptions): ComposerOptions {
  const locale = isString(options.locale) ? options.locale : 'en-US'
  const fallbackLocales = isString(options.fallbackLocale)
    ? [options.fallbackLocale]
    : []
  const missing = isFunction(options.missing) ? options.missing : undefined
  const missingWarn =
    isBoolean(options.silentTranslationWarn) ||
    isRegExp(options.silentTranslationWarn)
      ? !options.silentTranslationWarn
      : true
  const fallbackWarn =
    isBoolean(options.silentFallbackWarn) ||
    isRegExp(options.silentFallbackWarn)
      ? !options.silentFallbackWarn
      : true
  const fallbackRoot = isBoolean(options.fallbackRoot)
    ? options.fallbackRoot
    : true
  const fallbackFormat = isBoolean(options.formatFallbackMessages)
    ? options.formatFallbackMessages
    : false
  const pluralizationRules = options.pluralizationRules
  const postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : undefined

  if (__DEV__ && options.formatter) {
    warn(`not supportted 'formatter' option`)
  }

  let messages = options.messages
  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages
    const locales: Locale[] = Object.keys(sharedMessages)
    messages = locales.reduce((messages, locale) => {
      const message = messages[locale] || { [locale]: {} }
      Object.assign(message, sharedMessages[locale])
      return messages
    }, messages || {})
  }
  const { __i18n, _root } = options

  const datetimeFormats = options.datetimeFormats
  const numberFormats = options.numberFormats

  return {
    locale,
    fallbackLocales,
    messages,
    datetimeFormats,
    numberFormats,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackRoot,
    fallbackFormat,
    pluralRules: pluralizationRules,
    postTranslation,
    __i18n,
    _root
  }
}

/**
 *  createVueI18n factory
 *
 *  This function is compatible with constructor of `VueI18n` class (offered with vue-i18n@8.x) like `new VueI18n(...)`.
 */
export function createVueI18n(options: VueI18nOptions = {}): VueI18n {
  const composer = createComposer(convertComposerOptions(options))

  // defines VueI18n
  const i18n = {
    /**
     * properties
     */

    // locale
    get locale(): Locale {
      return composer.locale.value
    },
    set locale(val: Locale) {
      composer.locale.value = val
    },

    // fallbackLocale
    get fallbackLocale(): Locale {
      return composer.fallbackLocales.value.length === 0
        ? 'en-US' // compatible for vue-i18n legay style
        : composer.fallbackLocales.value[0]
    },
    set fallbackLocale(val: Locale) {
      composer.fallbackLocales.value = [val]
    },

    // messages
    get messages(): LocaleMessages {
      return composer.messages.value
    },

    // datetimeFormats
    get datetimeFormats(): DateTimeFormats {
      return composer.datetimeFormats.value
    },

    // numberFormats
    get numberFormats(): NumberFormats {
      return composer.numberFormats.value
    },

    // availableLocales
    get availableLocales(): Locale[] {
      return composer.availableLocales
    },

    // formatter
    get formatter(): Formatter {
      __DEV__ && warn(`not support 'formatter' property`)
      // dummy
      return {
        interpolate() {
          return []
        }
      }
    },
    set formatter(val: Formatter) {
      __DEV__ && warn(`not support 'formatter' property`)
    },

    // missing
    get missing(): MissingHandler | null {
      return composer.getMissingHandler()
    },
    set missing(handler: MissingHandler | null) {
      composer.setMissingHandler(handler)
    },

    // silentTranslationWarn
    get silentTranslationWarn(): boolean | RegExp {
      return isBoolean(composer.missingWarn)
        ? !composer.missingWarn
        : composer.missingWarn
    },
    set silentTranslationWarn(val: boolean | RegExp) {
      composer.missingWarn = isBoolean(val) ? !val : val
    },

    // silentFallbackWarn
    get silentFallbackWarn(): boolean | RegExp {
      return isBoolean(composer.fallbackWarn)
        ? !composer.fallbackWarn
        : composer.fallbackWarn
    },
    set silentFallbackWarn(val: boolean | RegExp) {
      composer.fallbackWarn = isBoolean(val) ? !val : val
    },

    // formatFallbackMessages
    get formatFallbackMessages(): boolean {
      return composer.fallbackFormat
    },
    set formatFallbackMessages(val: boolean) {
      composer.fallbackFormat = val
    },

    // postTranslation
    get postTranslation(): PostTranslationHandler | null {
      return composer.getPostTranslationHandler()
    },
    set postTranslation(handler: PostTranslationHandler | null) {
      composer.setPostTranslationHandler(handler)
    },

    /**
     * methods
     */

    // t
    t(...args: unknown[]): TranslateResult {
      const [arg1, arg2, arg3] = args
      const options = {} as TranslateOptions
      let list: unknown[] | null = null
      let named: NamedValue | null = null

      if (!isString(arg1)) {
        throw new Error('TODO')
      }
      const key = arg1

      if (isString(arg2)) {
        options.locale = arg2
      } else if (isArray(arg2)) {
        list = arg2
      } else if (isPlainObject(arg2)) {
        named = arg2 as NamedValue
      }

      if (isArray(arg3)) {
        list = arg3
      } else if (isPlainObject(arg3)) {
        named = arg3 as NamedValue
      }

      return composer.t(key, list || named || {}, options)
    },

    // tc
    tc(...args: unknown[]): TranslateResult {
      const [arg1, arg2, arg3] = args
      const options = { plural: 1 } as TranslateOptions
      let list: unknown[] | null = null
      let named: NamedValue | null = null

      if (!isString(arg1)) {
        throw new Error('TODO')
      }
      const key = arg1

      if (isString(arg2)) {
        options.locale = arg2
      } else if (isNumber(arg2)) {
        options.plural = arg2
      } else if (isArray(arg2)) {
        list = arg2
      } else if (isPlainObject(arg2)) {
        named = arg2 as NamedValue
      }

      if (isString(arg3)) {
        options.locale = arg3
      } else if (isArray(arg3)) {
        list = arg3
      } else if (isPlainObject(arg3)) {
        named = arg3 as NamedValue
      }

      return composer.t(key, list || named || {}, options)
    },

    // te
    te(key: Path, locale?: Locale): boolean {
      const targetLocale = isString(locale) ? locale : composer.locale.value
      const message = composer.getLocaleMessage(targetLocale)
      return resolveValue(message, key) !== null
    },

    // getLocaleMessage
    getLocaleMessage(locale: Locale): LocaleMessage {
      return composer.getLocaleMessage(locale)
    },

    // setLocaleMessage
    setLocaleMessage(locale: Locale, message: LocaleMessage): void {
      composer.setLocaleMessage(locale, message)
    },

    // mergeLocaleMessasge
    mergeLocaleMessage(locale: Locale, message: LocaleMessage): void {
      composer.mergeLocaleMessage(locale, message)
    },

    // d
    d(...args: unknown[]): DateTimeFormatResult {
      return composer.d(...args)
    },

    // getDateTimeFormat
    getDateTimeFormat(locale: Locale): DateTimeFormat {
      return composer.getDateTimeFormat(locale)
    },

    // setDateTimeFormat
    setDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
      composer.setDateTimeFormat(locale, format)
    },

    // mergeDateTimeFormat
    mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
      composer.mergeDateTimeFormat(locale, format)
    },

    // n
    n(...args: unknown[]): NumberFormatResult {
      return composer.n(...args)
    },

    // getNumberFormat
    getNumberFormat(locale: Locale): NumberFormat {
      return composer.getNumberFormat(locale)
    },

    // setNumberFormat
    setNumberFormat(locale: Locale, format: NumberFormat): void {
      composer.setNumberFormat(locale, format)
    },

    // mergeNumberFormat
    mergeNumberFormat(locale: Locale, format: NumberFormat): void {
      composer.mergeNumberFormat(locale, format)
    },

    // getChoiceIndex
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getChoiceIndex(choice: Choice, choicesLength: number): number {
      __DEV__ && warn(`not supportted 'getChoiceIndex' method.`)
      return -1
    },

    // install
    install(app: App): void {
      apply(app, composer)
      app.mixin(getMixin(i18n, composer))
    }
  }

  return i18n
}
