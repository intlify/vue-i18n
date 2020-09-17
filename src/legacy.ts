/**
 *  Legacy
 *
 *  This module is offered legacy vue-i18n API compatibility
 */

import { Path, resolveValue } from './path'
import {
  PluralizationRule,
  PluralizationRules,
  LinkedModifiers,
  NamedValue
} from './message/runtime'
import {
  Locale,
  LocaleMessages,
  LocaleMessageDictionary,
  PostTranslationHandler,
  FallbackLocale,
  LocaleMessageValue
} from './core/context'
import { TranslateOptions } from './core/translate'
import {
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  DateTimeFormat,
  NumberFormat
} from './core/types'
import {
  VueMessageType,
  MissingHandler,
  Composer,
  ComposerOptions,
  ComposerInternalOptions,
  createComposer,
  ComposerIdSymbol
} from './composer'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { createI18nError, I18nErrorCodes } from './errors'
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
export type LocaleMessageObject<Message = string> = LocaleMessageDictionary<
  Message
>
export type PluralizationRulesMap = { [locale: string]: PluralizationRule }
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'
export type DateTimeFormatResult = string
export type NumberFormatResult = string
export interface Formatter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interpolate(message: string, values: any, path: string): Array<any> | null
}
export type ComponentInstanceCreatedListener = <Messages>(
  target: VueI18n<Messages>,
  global: VueI18n<Messages>
) => void

/**
 *  VueI18n Options
 *
 *  @remarks
 *  This option is compatible with the constructor options of `VueI18n` class (offered with vue-i18n@8.x).
 */
export interface VueI18nOptions {
  locale?: Locale
  fallbackLocale?: FallbackLocale
  messages?: LocaleMessages<VueMessageType>
  datetimeFormats?: DateTimeFormatsType
  numberFormats?: NumberFormatsType
  availableLocales?: Locale[]
  modifiers?: LinkedModifiers<VueMessageType>
  formatter?: Formatter
  missing?: MissingHandler
  fallbackRoot?: boolean
  silentTranslationWarn?: boolean | RegExp
  silentFallbackWarn?: boolean | RegExp
  formatFallbackMessages?: boolean
  preserveDirectiveContent?: boolean
  warnHtmlInMessage?: WarnHtmlInMessageLevel
  sharedMessages?: LocaleMessages<VueMessageType>
  pluralizationRules?: PluralizationRules
  postTranslation?: PostTranslationHandler<VueMessageType>
  sync?: boolean
  componentInstanceCreatedListener?: ComponentInstanceCreatedListener
}

/**
 *  VueI18n Interfaces
 *
 *  @remarks
 *  This interface is compatible with interface of `VueI18n` class (offered with vue-i18n@8.x).
 */
export interface VueI18n<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {}
> {
  // properties
  locale: Locale
  fallbackLocale: FallbackLocale
  readonly availableLocales: Locale[]
  readonly messages: Messages
  readonly datetimeFormats: DateTimeFormats
  readonly numberFormats: NumberFormats
  formatter: Formatter
  missing: MissingHandler | null
  postTranslation: PostTranslationHandler<VueMessageType> | null
  silentTranslationWarn: boolean | RegExp
  silentFallbackWarn: boolean | RegExp
  formatFallbackMessages: boolean
  sync: boolean
  warnHtmlInMessage: WarnHtmlInMessageLevel
  preserveDirectiveContent: boolean
  // methods
  t(key: Path): TranslateResult
  t(key: Path, locale: Locale): TranslateResult
  t(key: Path, locale: Locale, list: unknown[]): TranslateResult
  t(key: Path, locale: Locale, named: object): TranslateResult
  t(key: Path, list: unknown[]): TranslateResult
  t(key: Path, named: Record<string, unknown>): TranslateResult
  t(...args: unknown[]): TranslateResult // for $t
  tc(key: Path): TranslateResult
  tc(key: Path, locale: Locale): TranslateResult
  tc(key: Path, list: unknown[]): TranslateResult
  tc(key: Path, named: Record<string, unknown>): TranslateResult
  tc(key: Path, choice: number): TranslateResult
  tc(key: Path, choice: number, locale: Locale): TranslateResult
  tc(key: Path, choice: number, list: unknown[]): TranslateResult
  tc(key: Path, choice: number, named: Record<string, unknown>): TranslateResult
  tc(...args: unknown[]): TranslateResult // for $tc
  te(key: Path, locale?: Locale): boolean
  tm(key: Path): LocaleMessageValue<VueMessageType> | {}
  getLocaleMessage(locale: Locale): LocaleMessageDictionary<VueMessageType>
  setLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<VueMessageType>
  ): void
  mergeLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<VueMessageType>
  ): void
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
}

/**
 * @internal
 */
export interface VueI18nInternal<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {}
> {
  __id: number
  __composer: Composer<Messages, DateTimeFormats, NumberFormats>
  __onComponentInstanceCreated(target: VueI18n<Messages>): void
}

/**
 * Convert to I18n Composer Options from VueI18n Options
 *
 * @internal
 */
function convertComposerOptions<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {}
>(
  options: VueI18nOptions &
    ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats>
): ComposerOptions &
  ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats> {
  const locale = isString(options.locale) ? options.locale : 'en-US'
  const fallbackLocale =
    isString(options.fallbackLocale) ||
    isArray(options.fallbackLocale) ||
    isPlainObject(options.fallbackLocale) ||
    options.fallbackLocale === false
      ? options.fallbackLocale
      : locale
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
  const fallbackFormat = !!options.formatFallbackMessages
  const pluralizationRules = options.pluralizationRules
  const postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : undefined
  const warnHtmlMessage = isString(options.warnHtmlInMessage)
    ? options.warnHtmlInMessage !== 'off'
    : true
  const inheritLocale = isBoolean(options.sync) ? options.sync : true

  if (__DEV__ && options.formatter) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER))
  }

  if (__DEV__ && options.preserveDirectiveContent) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE))
  }

  let messages = options.messages
  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages as LocaleMessages<
      VueMessageType
    >
    const locales: Locale[] = Object.keys(sharedMessages)
    messages = locales.reduce((messages, locale) => {
      const message = messages[locale] || (messages[locale] = {})
      Object.assign(message, sharedMessages[locale])
      return messages
    }, (messages || {}) as LocaleMessages<VueMessageType>) as typeof options.messages
  }
  const { __i18n, __root } = options

  const datetimeFormats = options.datetimeFormats
  const numberFormats = options.numberFormats

  return {
    locale,
    fallbackLocale,
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
    warnHtmlMessage,
    inheritLocale,
    __i18n,
    __root
  }
}

/**
 * create VueI18n interface factory
 *
 * @internal
 */
export function createVueI18n<
  Options extends VueI18nOptions = object,
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  > = Record<
    keyof Options['messages'],
    LocaleMessageDictionary<VueMessageType>
  >,
  DateTimeFormats extends Record<
    keyof Options['datetimeFormats'],
    DateTimeFormat
  > = Record<keyof Options['datetimeFormats'], DateTimeFormat>,
  NumberFormats extends Record<
    keyof Options['numberFormats'],
    NumberFormat
  > = Record<keyof Options['numberFormats'], NumberFormat>
>(
  options: Options = {} as Options
): VueI18n<
  Options['messages'],
  Options['datetimeFormats'],
  Options['numberFormats']
> {
  const composer = createComposer<VueMessageType>(
    convertComposerOptions<Messages, DateTimeFormats, NumberFormats>(options)
  ) as Composer<Messages, DateTimeFormats, NumberFormats>

  // defines VueI18n
  const vueI18n = {
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
    get fallbackLocale(): FallbackLocale {
      return composer.fallbackLocale.value
    },
    set fallbackLocale(val: FallbackLocale) {
      composer.fallbackLocale.value = val
    },

    // messages
    get messages(): Messages {
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
      __DEV__ && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER))
      // dummy
      return {
        interpolate() {
          return []
        }
      }
    },
    set formatter(val: Formatter) {
      __DEV__ && warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER))
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
    get postTranslation(): PostTranslationHandler<VueMessageType> | null {
      return composer.getPostTranslationHandler()
    },
    set postTranslation(
      handler: PostTranslationHandler<VueMessageType> | null
    ) {
      composer.setPostTranslationHandler(handler)
    },

    // sync
    get sync(): boolean {
      return composer.inheritLocale
    },
    set sync(val: boolean) {
      composer.inheritLocale = val
    },

    // warnInHtmlMessage
    get warnHtmlInMessage(): WarnHtmlInMessageLevel {
      return composer.warnHtmlMessage ? 'warn' : 'off'
    },
    set warnHtmlInMessage(val: WarnHtmlInMessageLevel) {
      composer.warnHtmlMessage = val !== 'off'
    },

    // preserveDirectiveContent
    get preserveDirectiveContent(): boolean {
      __DEV__ &&
        warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE))
      return true
    },
    set preserveDirectiveContent(val: boolean) {
      __DEV__ &&
        warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE))
    },

    // for internal
    __id: (composer as any)[ComposerIdSymbol], // eslint-disable-line @typescript-eslint/no-explicit-any
    __composer: composer,

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
        throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT)
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
        throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT)
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

    // tm
    tm(key: Path): LocaleMessageValue<VueMessageType> | {} {
      return composer.tm(key)
    },

    // getLocaleMessage
    getLocaleMessage(locale: Locale): LocaleMessageDictionary<VueMessageType> {
      return composer.getLocaleMessage(locale)
    },

    // setLocaleMessage
    setLocaleMessage(
      locale: Locale,
      message: LocaleMessageDictionary<VueMessageType>
    ): void {
      composer.setLocaleMessage(locale, message)
    },

    // mergeLocaleMessasge
    mergeLocaleMessage(
      locale: Locale,
      message: LocaleMessageDictionary<VueMessageType>
    ): void {
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
      __DEV__ &&
        warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX))
      return -1
    },

    // for internal
    __onComponentInstanceCreated(target: VueI18n<Messages>): void {
      const { componentInstanceCreatedListener } = options
      if (componentInstanceCreatedListener) {
        componentInstanceCreatedListener<Messages>(target, vueI18n)
      }
    }
  }

  return vueI18n
}
