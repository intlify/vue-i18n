import {
  ref,
  computed,
  getCurrentInstance,
  Text,
  createVNode,
  watch
} from 'vue'
import {
  warn,
  isArray,
  isFunction,
  isNumber,
  isString,
  isRegExp,
  isBoolean,
  isPlainObject,
  makeSymbol,
  isObject,
  hasOwn
} from '@intlify/shared'
import {
  isTranslateFallbackWarn,
  isTranslateMissingWarn,
  resolveValue,
  createCoreContext,
  MISSING_RESOLVE_VALUE,
  updateFallbackLocale,
  translate,
  parseTranslateArgs,
  datetime,
  parseDateTimeArgs,
  clearDateTimeFormat,
  number,
  parseNumberArgs,
  clearNumberFormat,
  getLocaleChain,
  NOT_REOSLVED,
  handleFlatJson,
  MessageFunction,
  setAdditionalMeta,
  getAdditionalMeta
} from '@intlify/core-base'
import { VueDevToolsTimelineEvents } from '@intlify/vue-devtools'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { I18nErrorCodes, createI18nError } from './errors'
import { VERSION } from './misc'

import type { ComponentInternalInstance, VNode, VNodeArrayChildren } from 'vue'
import type { WritableComputedRef, ComputedRef } from '@vue/reactivity'
import type {
  Path,
  LinkedModifiers,
  PluralizationRules,
  NamedValue,
  MessageFunctions,
  MessageProcessor,
  MessageType,
  Locale,
  LocaleMessageValue,
  LocaleMessages,
  CoreContext,
  CoreCommonContext,
  CoreTranslationContext,
  CoreDateTimeContext,
  CoreNumberContext,
  CoreMissingHandler,
  CoreOptions,
  LocaleMessageDictionary,
  PostTranslationHandler,
  FallbackLocale,
  CoreInternalContext,
  TranslateOptions,
  DateTimeOptions,
  NumberOptions,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  DateTimeFormat,
  NumberFormat,
  MetaInfo
} from '@intlify/core-base'
import type { VueDevToolsEmitter } from '@intlify/vue-devtools'

// extend VNode interface
declare module '@vue/runtime-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface VNode<HostNode = RendererNode, HostElement = RendererElement> {
    toString: () => string // mark for vue-i18n message runtime
  }
}

export const DEVTOOLS_META = '__INTLIFY_META__'

export const TransrateVNodeSymbol = makeSymbol('__transrateVNode')
export const DatetimePartsSymbol = makeSymbol('__datetimeParts')
export const NumberPartsSymbol = makeSymbol('__numberParts')
export const EnableEmitter = makeSymbol('__enableEmitter')
export const DisableEmitter = makeSymbol('__disableEmitter')
export const SetPluralRulesSymbol = makeSymbol('__setPluralRules')
export const DevToolsMetaSymbol = makeSymbol('__intlifyMeta')

/** @VueI18nComposition */
export type VueMessageType = string | VNode
/** @VueI18nComposition */
export type MissingHandler = (
  locale: Locale,
  key: Path,
  insttance?: ComponentInternalInstance,
  type?: string
) => string | void

export type PreCompileHandler<Message = VueMessageType> = () => {
  messages: LocaleMessages<Message>
  functions: MessageFunctions<Message>
}

export interface CustomBlock<Message = VueMessageType> {
  locale: Locale
  resource: LocaleMessages<Message> | LocaleMessageDictionary<Message>
}

export type CustomBlocks<Message = VueMessageType> = Array<CustomBlock<Message>>

/**
 * Composer Options
 *
 * @remarks
 * This is options to create composer.
 *
 * @VueI18nComposition
 */
export interface ComposerOptions<Message = VueMessageType> {
  /**
   * @remarks
   * The locale of localization.
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../../guide/essentials/scope)
   *
   * @defaultValue `'en-US'`
   */
  locale?: Locale
  /**
   * @remarks
   * The locale of fallback localization.
   *
   * For more complex fallback definitions see fallback.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   *
   * @defaultValue The default `'en-US'` for the `locale` if it's not specified, or it's `locale` value
   */
  fallbackLocale?: FallbackLocale
  /**
   * @remarks
   * Whether inheritance the root level locale to the component localization locale.
   *
   * If `false`, regardless of the root level locale, localize for each component locale.
   *
   * @VueI18nSee [Local Scope](../../guide/essentials/scope#local-scope-2)
   *
   * @defaultValue `true`
   */
  inheritLocale?: boolean
  /**
   * @remarks
   * The locale messages of localization.
   *
   * @VueI18nSee [Getting Started](../../guide/)
   *
   * @defaultValue `{}`
   */
  messages?: LocaleMessages<Message>
  /**
   * @remarks
   * Allow use flat json messages or not
   *
   * @defaultValue `false`
   */
  flatJson?: boolean
  /**
   * @remarks
   * The datetime formats of localization.
   *
   * @VueI18nSee [Datetime Formatting](../../guide/essentials/datetime)
   *
   * @defaultValue `{}`
   */
  datetimeFormats?: DateTimeFormatsType
  /**
   * @remarks
   * The number formats of localization.
   *
   * @VueI18nSee [Number Formatting](../../guide/essentials/number)
   *
   * @defaultValue `{}`
   */
  numberFormats?: NumberFormatsType
  /**
   * @remarks
   * Custom Modifiers for linked messages.
   *
   * @VueI18nSee [Custom Modifiers](../../guide/essentials/syntax#custom-modifiers)
   */
  modifiers?: LinkedModifiers<Message>
  /**
   * @remarks
   * A set of rules for word pluralization
   *
   * @VueI18nSee [Custom Pluralization](../../guide/essentials/pluralization#custom-pluralization)
   *
   * @defaultValue `{}`
   */
  pluralRules?: PluralizationRules
  /**
   * @remarks
   * A handler for localization missing.
   *
   * The handler gets called with the localization target locale, localization path key, the Vue instance and values.
   *
   * If missing handler is assigned, and occurred localization missing, it's not warned.
   *
   * @defaultValue `null`
   */
  missing?: MissingHandler
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   *
   * If `false`, suppress localization fail warnings.
   *
   * If you use regular expression, you can suppress localization fail warnings that it match with translation key (e.g. `t`).
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   *
   * @defaultValue `true`
   */
  missingWarn?: boolean | RegExp
  /**
   * @remarks
   * Whether suppress warnings when falling back to either `fallbackLocale` or root.
   *
   * If `false`, suppress fall back warnings.
   *
   * If you use regular expression, you can suppress fallback warnings that it match with translation key (e.g. `t`).
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   *
   * @defaultValue `true`
   */
  fallbackWarn?: boolean | RegExp
  /**
   * @remarks
   * In the component localization, whether to fallback to root level (global scope) localization when localization fails.
   *
   * If `false`, it's not fallback to root.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   *
   * @defaultValue `true`
   */
  fallbackRoot?: boolean
  /**
   * @remarks
   * Whether do template interpolation on translation keys when your language lacks a translation for a key.
   *
   * If `true`, skip writing templates for your "base" language; the keys are your templates.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   *
   * @defaultValue `false`
   */
  fallbackFormat?: boolean
  /**
   * @remarks
   * A handler for post processing of translation.
   *
   * The handler gets after being called with the `t`.
   *
   * This handler is useful if you want to filter on translated text such as space trimming.
   *
   * @defaultValue `null`
   */
  postTranslation?: PostTranslationHandler<Message>
  /**
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   *
   * See the warnHtmlMessage property.
   *
   * @VueI18nSee [HTML Message](../../guide/essentials/syntax#html-message)
   * @VueI18nSee [Change `warnHtmlInMessage` option default value](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)
   *
   * @defaultValue `'off'`
   */
  warnHtmlMessage?: boolean
  /**
   * @remarks
   * If `escapeParameter` is configured as true then interpolation parameters are escaped before the message is translated.
   *
   * This is useful when translation output is used in `v-html` and the translation resource contains html markup (e.g. <b> around a user provided value).
   *
   * This usage pattern mostly occurs when passing precomputed text strings into UI components.
   *
   * The escape process involves replacing the following symbols with their respective HTML character entities: `<`, `>`, `"`, `'`.
   *
   * Setting `escapeParameter` as true should not break existing functionality but provides a safeguard against a subtle type of XSS attack vectors.
   *
   * @VueI18nSee [HTML Message](../../guide/essentials/syntax#html-message)
   *
   * @defaultValue `false`
   */
  escapeParameter?: boolean
}

/**
 * @internal
 */
export interface ComposerInternalOptions<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  Message = VueMessageType
> {
  __i18n?: CustomBlocks<Message>
  __i18nGlobal?: CustomBlocks<Message>
  __root?: Composer<Messages, DateTimeFormats, NumberFormats, Message>
}

/**
 * Composer interfaces
 *
 * @remarks
 * This is the interface for being used for Vue 3 Composition API.
 *
 * @VueI18nComposition
 */
export interface Composer<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  Message = VueMessageType
> {
  /**
   * @remarks
   * Instance ID.
   */
  id: number
  /**
   * @remarks
   * The current locale this Composer instance is using.
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../../guide/essentials/scope)
   */
  locale: WritableComputedRef<Locale>
  /**
   * @remarks
   * The current fallback locales this Composer instance is using.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   */
  fallbackLocale: WritableComputedRef<FallbackLocale>
  /**
   * @remarks
   * Whether inherit the root level locale to the component localization locale.
   *
   * @VueI18nSee [Local Scope](../../guide/essentials/scope#local-scope-2)
   */
  inheritLocale: boolean
  /**
   * @remarks
   * The list of available locales in `messages` in lexical order.
   */
  readonly availableLocales: Locale[]
  /**
   * @remarks
   * The locale messages of localization.
   *
   * @VueI18nSee [Getting Started](../../guide/)
   */
  readonly messages: ComputedRef<Messages>
  /**
   * @remarks
   * The datetime formats of localization.
   *
   * @VueI18nSee [Datetime Formatting](../../guide/essentials/datetime)
   */
  readonly datetimeFormats: ComputedRef<DateTimeFormats>
  /**
   * @remarks
   * The number formats of localization.
   *
   * @VueI18nSee [Number Formatting](../../guide/essentials/number)
   */
  readonly numberFormats: ComputedRef<NumberFormats>
  /**
   * @remarks
   * Custom Modifiers for linked messages.
   *
   * @VueI18nSee [Custom Modifiers](../../guide/essentials/syntax#custom-modifiers)
   */
  readonly modifiers: LinkedModifiers<Message>
  /**
   * @remarks
   * A set of rules for word pluralization
   *
   * @VueI18nSee [Custom Pluralization](../../guide/essentials/pluralization#custom-pluralization)
   */
  readonly pluralRules: PluralizationRules
  /**
   * @remarks
   * Whether this composer instance is global or not
   */
  readonly isGlobal: boolean
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   */
  missingWarn: boolean | RegExp
  /**
   * @remarks
   * Whether suppress fall back warnings when localization fails.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   */
  fallbackWarn: boolean | RegExp
  /**
   * @remarks
   * Whether to fall back to root level (global scope) localization when localization fails.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   */
  fallbackRoot: boolean
  /**
   * @remarks
   * Whether suppress warnings when falling back to either `fallbackLocale` or root.
   *
   * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
   */
  fallbackFormat: boolean
  /**
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   *
   * If you set `false`, will check the locale messages on the Composer instance.
   *
   * If you are specified `true`, a warning will be output at console.
   *
   * @VueI18nSee [HTML Message](../../guide/essentials/syntax#html-message)
   * @VueI18nSee [Change `warnHtmlInMessage` option default value](../../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)
   */
  warnHtmlMessage: boolean
  /**
   * @remarks
   * Whether interpolation parameters are escaped before the message is translated.
   *
   * @VueI18nSee [HTML Message](../../guide/essentials/syntax#html-message)
   */
  escapeParameter: boolean
  /**
   * Locale message translation
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   *
   * If not, then it’s translated with global scope locale messages.
   *
   * @param key - A target locale message key
   *
   * @returns Translated message
   *
   * @VueI18nSee [Scope and Locale Changing](../../guide/essentials/scope)
   */
  t(key: Path | number): string
  /**
   * Locale message translation for plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, return a pluralized translation message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param plural - Which plural string to get. 1 returns the first one.
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../../guide/essentials/pluralization)
   */
  t(key: Path | number, plural: number, options?: TranslateOptions): string
  /**
   * Locale message translation for missing default message
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, if no translation was found, return a default message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param defaultMsg - A default message to return if no translation was found
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   */
  t(key: Path | number, defaultMsg: string, options?: TranslateOptions): string
  /**
   * Locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../../guide/essentials/syntax#list-interpolation)
   */
  t(key: Path | number, list: unknown[], options?: TranslateOptions): string
  /**
   * Locale message translation for list interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../../guide/essentials/pluralization)
   * @VueI18nSee [List interpolation](../../guide/essentials/syntax#list-interpolation)
   */
  t(key: Path | number, list: unknown[], plural: number): string
  /**
   * Locale message translation for list interpolations and missing default message
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and if no translation was found, return a default message.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../../guide/essentials/syntax#list-interpolation)
   */
  t(key: Path | number, list: unknown[], defaultMsg: string): string
  /**
   * Locale message translation for named interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * About details of options, see the {@link TranslateOptions}.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../../guide/essentials/syntax#named-interpolation)
   */
  t(key: Path | number, named: NamedValue, options?: TranslateOptions): string
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../../guide/essentials/pluralization)
   * @VueI18nSee [Named interpolation](../../guide/essentials/syntax#named-interpolation)
   */
  t(key: Path | number, named: NamedValue, plural: number): string
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [t](composition#t-key) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and if no translation was found, return a default message.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../../guide/essentials/syntax#named-interpolation)
   */
  t(key: Path | number, named: NamedValue, defaultMsg: string): string
  /** @internal */
  t(...args: unknown[]): string
  /**
   * Resolve locale message translation
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   *
   * If not, then it’s translated with global scope locale messages.
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Scope and Locale Changing](../../guide/essentials/scope)
   */
  rt(message: MessageFunction<Message> | Message): string
  /**
   * Resolve locale message translation for plurals
   *
   * @remarks
   * Overloaded `rt`. About details, see the [rt](composition#rt-message) details.
   *
   * In this overloaded `rt`, return a pluralized translation message.
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   * @param plural - Which plural string to get. 1 returns the first one.
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../../guide/essentials/pluralization)
   */
  rt(
    message: MessageFunction<Message> | Message,
    plural: number,
    options?: TranslateOptions
  ): string
  /**
   * Resolve locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `rt`. About details, see the [rt](composition#rt-message) details.
   *
   * In this overloaded `rt`, return a pluralized translation message.
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   * @param list - A values of list interpolation.
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../../guide/essentials/syntax#list-interpolation)
   */
  rt(
    message: MessageFunction<Message> | Message,
    list: unknown[],
    options?: TranslateOptions
  ): string
  /**
   * Resolve locale message translation for named interpolations
   *
   * @remarks
   * Overloaded `rt`. About details, see the [rt](composition#rt-message) details.
   *
   * In this overloaded `rt`, for each placeholder x, the locale messages should contain a `{x}` token.
   *
   * @VueI18nTip
   * The use-case for `rt` is for programmatic locale messages translation with using `tm`, `v-for`, javascript `for` statement.
   *
   * @VueI18nWarning
   * `rt` differs from `t` in that it processes the locale message directly, not the key of the locale message. There is no internal fallback with `rt`. You need to understand and use the structure of the locale messge returned by `tm`.
   *
   * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `tm`.
   * @param named - A values of named interpolation.
   * @param options - Additional {@link TranslateOptions | options} for translation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../../guide/essentials/syntax#named-interpolation)
   */
  rt(
    message: MessageFunction<Message> | Message,
    named: NamedValue,
    options?: TranslateOptions
  ): string
  /** @internal */
  rt(...args: unknown[]): string
  /**
   * Datetime formatting
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.
   *
   * If not, then it’s formatted with global scope datetime formats.
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   *
   * @returns Formatted value
   *
   * @VueI18nSee [Datetime formatting](../../guide/essentials/datetime)
   */
  d(value: number | Date | string): string
  /**
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [d](composition#d-value) details.
   *
   * In this overloaded `d`, format in datetime format for a key registered in datetime formats.
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   * @param key - A key of datetime formats
   *
   * @returns Formatted value
   */
  d(value: number | Date | string, key: string): string
  /**
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [d](composition#d-value) details.
   *
   * In this overloaded `d`, format in datetime format for a key registered in datetime formats at target locale
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   * @param key - A key of datetime formats
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Formatted value
   */
  d(value: number | Date | string, key: string, locale: Locale): string
  /**
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [d](composition#d-value) details.
   *
   * You can also suppress the warning, when the formatting missing according to the options.
   *
   * About details of options, see the {@link DateTimeOptions}.
   *
   * @param value - A value, timestamp number or `Date` instance or ISO 8601 string
   * @param options - Additional {@link DateTimeOptions | options} for datetime formatting
   *
   * @returns Formatted value
   */
  d(value: number | Date | string, options: DateTimeOptions): string
  /** @internal */
  d(...args: unknown[]): string
  /**
   * Number Formatting
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope datetime formats than global scope datetime formats.
   *
   * If not, then it’s formatted with global scope number formats.
   *
   * @param value - A number value
   *
   * @returns Formatted value
   *
   * @VueI18nSee [Number formatting](../../guide/essentials/number)
   */
  n(value: number): string
  /**
   * Number Formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [n](composition#n-value) details.
   *
   * In this overloaded `n`, format in number format for a key registered in number formats.
   *
   * @param value - A number value
   * @param key - A key of number formats
   *
   * @returns Formatted value
   */
  n(value: number, key: string): string
  /**
   * Number Formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [n](composition#n-value) details.
   *
   * In this overloaded `n`, format in number format for a key registered in number formats at target locale.
   *
   * @param value - A number value
   * @param key - A key of number formats
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Formatted value
   */
  n(value: number, key: string, locale: Locale): string
  /**
   *
   * Number Formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [n](composition#n-value) details.
   *
   * You can also suppress the warning, when the formatting missing according to the options.
   *
   * About details of options, see the {@link NumberOptions}.
   *
   * @param value - A number value
   * @param options - Additional {@link NumberOptions | options} for number formatting
   *
   * @returns Formatted value
   */
  n(value: number, options: NumberOptions): string
  /** @internal */
  n(...args: unknown[]): string
  /**
   * Translation locale message exist
   *
   * @remarks
   * whether do exist locale message on Composer instance [messages](composition#messages).
   *
   * If you specified `locale`, check the locale messages of `locale`.
   *
   * @param key - A target locale message key
   * @param locale - A locale, it will be used over than global scope or local scope
   *
   * @returns If found locale message, `true`, else `false`
   */
  te(key: Path, locale?: Locale): boolean
  /**
   * Locale messages getter
   *
   * @remarks
   * If [UseI18nScope](general#usei18nscope) `'local'` or Some [UseI18nOptions](composition#usei18noptions) are specified at `useI18n`, it’s translated in preferentially local scope locale messages than global scope locale messages.
   *
   * Based on the current `locale`, locale messages will be returned from Composer instance messages.
   *
   * If you change the `locale`, the locale messages returned will also correspond to the locale.
   *
   * If there are no locale messages for the given `key` in the composer instance messages, they will be returned with [fallbacking](../../guide/essentials/fallback).
   *
   * @VueI18nWarning
   * You need to use `rt` for the locale message returned by `tm`. see the [rt](composition#rt-message) details.
   *
   * @example
   * template block:
   * ```html
   * <div class="container">
   *   <template v-for="content in tm('contents')">
   *     <h2>{{ rt(content.title) }}</h2>
   *     <p v-for="paragraph in content.paragraphs">
   *      {{ rt(paragraph) }}
   *     </p>
   *   </template>
   * </div>
   * ```
   * script block:
   * ```js
   * import { defineComponent } from 'vue
   * import { useI18n } from 'vue-i18n'
   *
   * export default defineComponent({
   *   setup() {
   *     const { rt, tm } = useI18n({
   *       messages: {
   *         en: {
   *           contents: [
   *             {
   *               title: 'Title1',
   *               // ...
   *               paragraphs: [
   *                 // ...
   *               ]
   *             }
   *           ]
   *         }
   *       }
   *       // ...
   *     })
   *     // ...
   *     return { ... , rt, tm }
   *   }
   * })
   * ```
   *
   * @param key - A target locale message key
   *
   * @return Locale messages
   */
  tm(key: Path): LocaleMessageValue<Message> | {}
  /**
   * Get locale message
   *
   * @remarks
   * get locale message from Composer instance [messages](composition#messages).
   *
   * @param locale - A target locale
   *
   * @returns Locale messages
   */
  getLocaleMessage(locale: Locale): LocaleMessageDictionary<Message>
  /**
   * Set locale message
   *
   * @remarks
   * Set locale message to Composer instance [messages](composition#messages).
   *
   * @param locale - A target locale
   * @param message - A message
   */
  setLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void
  /**
   * Merge locale message
   *
   * @remarks
   * Merge locale message to Composer instance [messages](composition#messages).
   *
   * @param locale - A target locale
   * @param message - A message
   */
  mergeLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void
  /**
   * Get datetime format
   *
   * @remarks
   * get datetime format from Composer instance [datetimeFormats](composition#datetimeformats).
   *
   * @param locale - A target locale
   *
   * @returns Datetime format
   */
  getDateTimeFormat(locale: Locale): DateTimeFormat
  /**
   * Set datetime format
   *
   * @remarks
   * Set datetime format to Composer instance [datetimeFormats](composition#datetimeformats).
   *
   * @param locale - A target locale
   * @param format - A target datetime format
   */
  setDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  /**
   * Merge datetime format
   *
   * @remarks
   * Merge datetime format to Composer instance [datetimeFormats](composition#datetimeformats).
   *
   * @param locale - A target locale
   * @param format - A target datetime format
   */
  mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  /**
   * Get number format
   *
   * @remarks
   * get number format from Composer instance [numberFormats](composition#numberFormats).
   *
   * @param locale - A target locale
   *
   * @returns Number format
   */
  getNumberFormat(locale: Locale): NumberFormat
  /**
   * Set number format
   *
   * @remarks
   * Set number format to Composer instance [numberFormats](composition#numberFormats).
   *
   * @param locale - A target locale
   * @param format - A target number format
   */
  setNumberFormat(locale: Locale, format: NumberFormat): void
  /**
   * Merge number format
   *
   * @remarks
   * Merge number format to Composer instance [numberFormats](composition#numberFormats).
   *
   * @param locale - A target locale
   * @param format - A target number format
   */
  mergeNumberFormat(locale: Locale, format: NumberFormat): void
  /**
   * Get post translation handler
   *
   * @returns {@link PostTranslationHandler}
   *
   * @VueI18nSee [missing](composition#posttranslation)
   */
  getPostTranslationHandler(): PostTranslationHandler<Message> | null
  /**
   * Set post translation handler
   *
   * @param handler - A {@link PostTranslationHandler}
   *
   * @VueI18nSee [missing](composition#posttranslation)
   */
  setPostTranslationHandler(
    handler: PostTranslationHandler<Message> | null
  ): void
  /**
   * Get missing handler
   *
   * @returns {@link MissingHandler}
   *
   * @VueI18nSee [missing](composition#missing)
   */
  getMissingHandler(): MissingHandler | null
  /**
   * Set missing handler
   *
   * @param handler - A {@link MissingHandler}
   *
   * @VueI18nSee [missing](composition#missing)
   */
  setMissingHandler(handler: MissingHandler | null): void
}

/**
 * @internal
 */
export interface ComposerInternal {
  __transrateVNode(...args: unknown[]): VNodeArrayChildren
  __numberParts(...args: unknown[]): string | Intl.NumberFormatPart[]
  __datetimeParts(...args: unknown[]): string | Intl.DateTimeFormatPart[]
  __enableEmitter?: (emitter: VueDevToolsEmitter) => void
  __disableEmitter?: () => void
  __setPluralRules(rules: PluralizationRules): void
}

type ComposerWarnType = 'translate' | 'number format' | 'datetime format'

let composerID = 0

function defineCoreMissingHandler<Message = VueMessageType>(
  missing: MissingHandler
): CoreMissingHandler<Message> {
  return ((
    ctx: CoreCommonContext<Message>,
    locale: Locale,
    key: Path,
    type: string
  ): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined, type)
  }) as CoreMissingHandler<Message>
}

type GetLocaleMessagesOptions<Message = VueMessageType> = {
  messages?: LocaleMessages<Message>
  __i18n?: CustomBlocks<Message>
  flatJson?: boolean
}

export function getLocaleMessages<Message = VueMessageType>(
  locale: Locale,
  options: GetLocaleMessagesOptions<Message>
): LocaleMessages<Message> {
  const { messages, __i18n } = options

  // prettier-ignore
  const ret = isPlainObject(messages)
    ? messages
    : isArray(__i18n)
      ? {}
      : { [locale]: {} }

  // merge locale messages of i18n custom block
  if (isArray(__i18n)) {
    __i18n.forEach(({ locale, resource }) => {
      if (locale) {
        ret[locale] = ret[locale] || {}
        deepCopy(resource, ret[locale])
      } else {
        deepCopy(resource, ret)
      }
    })
  }

  // handle messages for flat json
  if (options.flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key])
      }
    }
  }

  return ret
}

const isNotObjectOrIsArray = (val: unknown) => !isObject(val) || isArray(val)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepCopy(src: any, des: any): void {
  // src and des should both be objects, and non of then can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE)
  }

  for (const key in src) {
    if (hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        // replace with src[key] when:
        // src[key] or des[key] is not a object, or
        // src[key] or des[key] is a array
        des[key] = src[key]
      } else {
        // src[key] and des[key] are both object, merge them
        deepCopy(src[key], des[key])
      }
    }
  }
}

// for Intlify DevTools
const getMetaInfo = /* #__PURE__*/ (): MetaInfo | null => {
  const instance = getCurrentInstance()
  console.log('getMetaInfo', instance)
  return instance && (instance.type as any)[DEVTOOLS_META]
    ? { [DEVTOOLS_META]: (instance.type as any)[DEVTOOLS_META] }
    : null
}

/**
 * Create composer interface factory
 *
 * @internal
 */
export function createComposer<
  Message = VueMessageType,
  Options extends ComposerOptions<Message> = object,
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<Message>
  > = Record<keyof Options['messages'], LocaleMessageDictionary<Message>>,
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
): Composer<
  Options['messages'],
  Options['datetimeFormats'],
  Options['numberFormats'],
  Message
> {
  const { __root } = options as ComposerInternalOptions<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Message
  >
  const _isGlobal = __root === undefined

  let _inheritLocale = isBoolean(options.inheritLocale)
    ? options.inheritLocale
    : true

  const _locale = ref<Locale>(
    // prettier-ignore
    __root && _inheritLocale
      ? __root.locale.value
      : isString(options.locale)
        ? options.locale
        : 'en-US'
  )

  const _fallbackLocale = ref<FallbackLocale>(
    // prettier-ignore
    __root && _inheritLocale
      ? __root.fallbackLocale.value
      : isString(options.fallbackLocale) ||
        isArray(options.fallbackLocale) ||
        isPlainObject(options.fallbackLocale) ||
        options.fallbackLocale === false
        ? options.fallbackLocale
        : _locale.value
  )

  const _messages = ref<LocaleMessages<Message>>(
    getLocaleMessages<Message>(_locale.value, options)
  )

  const _datetimeFormats = ref<DateTimeFormatsType>(
    isPlainObject(options.datetimeFormats)
      ? options.datetimeFormats
      : { [_locale.value]: {} }
  )

  const _numberFormats = ref<NumberFormatsType>(
    isPlainObject(options.numberFormats)
      ? options.numberFormats
      : { [_locale.value]: {} }
  )

  // warning suppress options
  // prettier-ignore
  let _missingWarn = __root
    ? __root.missingWarn
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true

  // prettier-ignore
  let _fallbackWarn = __root
    ? __root.fallbackWarn
    : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true

  // prettier-ignore
  let _fallbackRoot = __root
    ? __root.fallbackRoot
    : isBoolean(options.fallbackRoot)
      ? options.fallbackRoot
      : true

  // configure fall back to root
  let _fallbackFormat = !!options.fallbackFormat

  // runtime missing
  let _missing = isFunction(options.missing) ? options.missing : null
  let _runtimeMissing = isFunction(options.missing)
    ? defineCoreMissingHandler<Message>(options.missing)
    : null

  // postTranslation handler
  let _postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null

  let _warnHtmlMessage = isBoolean(options.warnHtmlMessage)
    ? options.warnHtmlMessage
    : true

  let _escapeParameter = !!options.escapeParameter

  // custom linked modifiers
  // prettier-ignore
  const _modifiers = __root
    ? __root.modifiers
    : isPlainObject(options.modifiers)
      ? options.modifiers
      : {} as LinkedModifiers<Message>

  // pluralRules
  let _pluralRules = options.pluralRules || (__root && __root.pluralRules)

  // runtime context
  // eslint-disable-next-line prefer-const
  let _context: CoreContext<Messages, DateTimeFormats, NumberFormats, Message>

  function getCoreContext(): CoreContext<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Message
  > {
    return createCoreContext<Message>({
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      datetimeFormats: _datetimeFormats.value,
      numberFormats: _numberFormats.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? undefined : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? undefined : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      __datetimeFormatters: isPlainObject(_context)
        ? ((_context as unknown) as CoreInternalContext).__datetimeFormatters
        : undefined,
      __numberFormatters: isPlainObject(_context)
        ? ((_context as unknown) as CoreInternalContext).__numberFormatters
        : undefined,
      __v_emitter: isPlainObject(_context)
        ? ((_context as unknown) as CoreInternalContext).__v_emitter
        : undefined,
      __meta: { framework: 'vue' }
    } as CoreOptions<Message>) as CoreContext<
      Messages,
      DateTimeFormats,
      NumberFormats,
      Message
    >
  }

  _context = getCoreContext()
  updateFallbackLocale<Message>(_context, _locale.value, _fallbackLocale.value)

  // track reactivity
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ]
  }

  // locale
  const locale = computed({
    get: () => _locale.value,
    set: val => {
      _locale.value = val
      _context.locale = _locale.value
    }
  })

  // fallbackLocale
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: val => {
      _fallbackLocale.value = val
      _context.fallbackLocale = _fallbackLocale.value
      updateFallbackLocale(_context, _locale.value, val)
    }
  })

  // messages
  const messages = computed<Messages>(() => _messages.value as Messages)

  // datetimeFormats
  const datetimeFormats = computed<DateTimeFormats>(
    () => _datetimeFormats.value as DateTimeFormats
  )

  // numberFormats
  const numberFormats = computed<NumberFormats>(
    () => _numberFormats.value as NumberFormats
  )

  // getPostTranslationHandler
  function getPostTranslationHandler(): PostTranslationHandler<Message> | null {
    return isFunction(_postTranslation) ? _postTranslation : null
  }

  // setPostTranslationHandler
  function setPostTranslationHandler(
    handler: PostTranslationHandler<Message> | null
  ): void {
    _postTranslation = handler
    _context.postTranslation = handler
  }

  // getMissingHandler
  function getMissingHandler(): MissingHandler | null {
    return _missing
  }

  // setMissingHandler
  function setMissingHandler(handler: MissingHandler | null): void {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler)
    }
    _missing = handler
    _context.missing = _runtimeMissing
  }

  function isResolvedTranslateMessage(
    type: ComposerWarnType,
    arg: any // eslint-disable-line @typescript-eslint/no-explicit-any
  ): boolean {
    return type !== 'translate' || !!arg.resolvedMessage === false
  }

  function wrapWithDeps<T, U = T>(
    fn: (context: unknown) => unknown,
    argumentParser: () => unknown[],
    warnType: ComposerWarnType,
    fallbackSuccess: (root: Composer<T> & ComposerInternal) => U,
    fallbackFail: (key: unknown) => U,
    successCondition: (val: unknown) => boolean
  ): U {
    trackReactivityValues() // track reactive dependency
    // NOTE: experimental !!
    let ret: unknown
    if (__DEV__ || __FEATURE_PROD_INTLIFY_DEVTOOLS__) {
      try {
        setAdditionalMeta(getMetaInfo())
        ret = fn(_context)
      } finally {
        setAdditionalMeta(null)
      }
    } else {
      ret = fn(_context)
    }
    if (isNumber(ret) && ret === NOT_REOSLVED) {
      const [key, arg2] = argumentParser()
      if (
        __DEV__ &&
        __root &&
        isString(key) &&
        isResolvedTranslateMessage(warnType, arg2)
      ) {
        if (
          _fallbackRoot &&
          (isTranslateFallbackWarn(_fallbackWarn, key) ||
            isTranslateMissingWarn(_missingWarn, key))
        ) {
          warn(
            getWarnMessage(I18nWarnCodes.FALLBACK_TO_ROOT, {
              key,
              type: warnType
            })
          )
        }
        // for vue-devtools timeline event
        if (__DEV__) {
          const {
            __v_emitter: emitter
          } = (_context as unknown) as CoreInternalContext
          if (emitter && _fallbackRoot) {
            emitter.emit(VueDevToolsTimelineEvents.FALBACK, {
              type: warnType,
              key,
              to: 'global',
              groupId: `${warnType}:${key}`
            })
          }
        }
      }
      return __root && _fallbackRoot
        ? fallbackSuccess((__root as unknown) as Composer<T> & ComposerInternal)
        : fallbackFail(key)
    } else if (successCondition(ret)) {
      return ret as U
    } else {
      /* istanbul ignore next */
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE)
    }
  }

  // t
  function t(...args: unknown[]): string {
    return wrapWithDeps<string>(
      context =>
        translate<Messages, string>(
          context as CoreTranslationContext<Messages, string>,
          ...args
        ),
      () => parseTranslateArgs(...args),
      'translate',
      root => root.t(...args),
      key => key as string,
      val => isString(val)
    )
  }

  // rt
  function rt(...args: unknown[]): string {
    const [arg1, arg2, arg3] = args
    if (arg3 && !isObject(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT)
    }
    return t(
      ...[arg1, arg2, Object.assign({ resolvedMessage: true }, arg3 || {})]
    )
  }

  // d
  function d(...args: unknown[]): string {
    return wrapWithDeps<string>(
      context =>
        datetime<DateTimeFormats, string>(
          context as CoreDateTimeContext<DateTimeFormats, string>,
          ...args
        ),
      () => parseDateTimeArgs(...args),
      'datetime format',
      root => root.d(...args),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
  }

  // n
  function n(...args: unknown[]): string {
    return wrapWithDeps<string>(
      context =>
        number<NumberFormats, string>(
          context as CoreNumberContext<NumberFormats, string>,
          ...args
        ),
      () => parseNumberArgs(...args),
      'number format',
      root => root.n(...args),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
  }

  // for custom processor
  function normalize(
    values: MessageType<string | VNode>[]
  ): MessageType<VNode>[] {
    return values.map(val =>
      isString(val) ? createVNode(Text, null, val, 0) : val
    )
  }
  const interpolate = (val: unknown): MessageType<VNode> => val as VNode
  const processor = {
    normalize,
    interpolate,
    type: 'vnode'
  } as MessageProcessor<VNode>

  // transrateVNode, using for `i18n-t` component
  function transrateVNode(...args: unknown[]): VNodeArrayChildren {
    return wrapWithDeps<VNode, VNodeArrayChildren>(
      context => {
        let ret: unknown
        const _context = context as CoreTranslationContext<Messages, VNode>
        try {
          _context.processor = processor
          ret = translate<Messages, VNode>(_context, ...args)
        } finally {
          _context.processor = null
        }
        return ret
      },
      () => parseTranslateArgs(...args),
      'translate',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      root => (root as any)[TransrateVNodeSymbol](...args),
      key => [createVNode(Text, null, key, 0)],
      val => isArray(val)
    )
  }

  // numberParts, using for `i18n-n` component
  function numberParts(...args: unknown[]): string | Intl.NumberFormatPart[] {
    return wrapWithDeps<string | Intl.NumberFormatPart[]>(
      context => number(context as CoreContext<Messages, string>, ...args),
      () => parseNumberArgs(...args),
      'number format',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      root => (root as any)[NumberPartsSymbol](...args),
      () => [],
      val => isString(val) || isArray(val)
    )
  }

  // datetimeParts, using for `i18n-d` component
  function datetimeParts(
    ...args: unknown[]
  ): string | Intl.DateTimeFormatPart[] {
    return wrapWithDeps<string | Intl.DateTimeFormatPart[]>(
      context => datetime(context as CoreContext<Messages, string>, ...args),
      () => parseDateTimeArgs(...args),
      'datetime format',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      root => (root as any)[DatetimePartsSymbol](...args),
      () => [],
      val => isString(val) || isArray(val)
    )
  }

  function setPluralRules(rules: PluralizationRules): void {
    _pluralRules = rules
    _context.pluralRules = _pluralRules
  }

  // te
  function te(key: Path, locale?: Locale): boolean {
    const targetLocale = isString(locale) ? locale : _locale.value
    const message = getLocaleMessage(targetLocale)
    return resolveValue(message, key) !== null
  }

  function resolveMessages(key: Path): LocaleMessageValue<Message> | null {
    let messages: LocaleMessageValue<Message> | null = null
    const locales = getLocaleChain<Message>(
      _context,
      _fallbackLocale.value,
      _locale.value
    )
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {}
      const messageValue = resolveValue(targetLocaleMessages, key)
      if (messageValue != null) {
        messages = messageValue as LocaleMessageValue<Message>
        break
      }
    }
    return messages
  }

  // tm
  function tm(key: Path): LocaleMessageValue<Message> | {} {
    const messages = resolveMessages(key)
    // prettier-ignore
    return messages != null
      ? messages
      : __root
        ? __root.tm(key) as LocaleMessageValue<Message> || {}
        : {}
  }

  // getLocaleMessage
  function getLocaleMessage(locale: Locale): LocaleMessageDictionary<Message> {
    return (_messages.value[locale] || {}) as LocaleMessageDictionary<Message>
  }

  // setLocaleMessage
  function setLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ) {
    _messages.value[locale] = message
    _context.messages = _messages.value as typeof _context.messages
  }

  // mergeLocaleMessage
  function mergeLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void {
    _messages.value[locale] = _messages.value[locale] || {}
    deepCopy(message, _messages.value[locale])
    _context.messages = _messages.value as typeof _context.messages
  }

  // getDateTimeFormat
  function getDateTimeFormat(locale: Locale): DateTimeFormat {
    return _datetimeFormats.value[locale] || {}
  }

  // setDateTimeFormat
  function setDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = format
    _context.datetimeFormats = _datetimeFormats.value as typeof _context.datetimeFormats
    clearDateTimeFormat<DateTimeFormats, Message>(_context, locale, format)
  }

  // mergeDateTimeFormat
  function mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = Object.assign(
      _datetimeFormats.value[locale] || {},
      format
    )
    _context.datetimeFormats = _datetimeFormats.value as typeof _context.datetimeFormats
    clearDateTimeFormat<DateTimeFormats, Message>(_context, locale, format)
  }

  // getNumberFormat
  function getNumberFormat(locale: Locale): NumberFormat {
    return _numberFormats.value[locale] || {}
  }

  // setNumberFormat
  function setNumberFormat(locale: Locale, format: NumberFormat): void {
    _numberFormats.value[locale] = format
    _context.numberFormats = _numberFormats.value as typeof _context.numberFormats
    clearNumberFormat<NumberFormats, Message>(_context, locale, format)
  }

  // mergeNumberFormat
  function mergeNumberFormat(locale: Locale, format: NumberFormat): void {
    _numberFormats.value[locale] = Object.assign(
      _numberFormats.value[locale] || {},
      format
    )
    _context.numberFormats = _numberFormats.value as typeof _context.numberFormats
    clearNumberFormat<NumberFormats, Message>(_context, locale, format)
  }

  // for debug
  composerID++

  // watch root locale & fallbackLocale
  if (__root) {
    watch(__root.locale, (val: Locale) => {
      if (_inheritLocale) {
        _locale.value = val
        _context.locale = val
        updateFallbackLocale<Message>(
          _context,
          _locale.value,
          _fallbackLocale.value
        )
      }
    })
    watch(__root.fallbackLocale, (val: FallbackLocale) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val
        _context.fallbackLocale = val
        updateFallbackLocale<Message>(
          _context,
          _locale.value,
          _fallbackLocale.value
        )
      }
    })
  }

  // define composition API!
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale(): boolean {
      return _inheritLocale
    },
    set inheritLocale(val: boolean) {
      _inheritLocale = val
      if (val && __root) {
        _locale.value = __root.locale.value
        _fallbackLocale.value = __root.fallbackLocale.value
        updateFallbackLocale<Message>(
          _context,
          _locale.value,
          _fallbackLocale.value
        )
      }
    },
    get availableLocales(): Locale[] {
      return Object.keys(_messages.value).sort()
    },
    messages,
    datetimeFormats,
    numberFormats,
    get modifiers(): LinkedModifiers<Message> {
      return _modifiers
    },
    get pluralRules(): PluralizationRules {
      return _pluralRules || {}
    },
    get isGlobal(): boolean {
      return _isGlobal
    },
    get missingWarn(): boolean | RegExp {
      return _missingWarn
    },
    set missingWarn(val: boolean | RegExp) {
      _missingWarn = val
      _context.missingWarn = _missingWarn
    },
    get fallbackWarn(): boolean | RegExp {
      return _fallbackWarn
    },
    set fallbackWarn(val: boolean | RegExp) {
      _fallbackWarn = val
      _context.fallbackWarn = _fallbackWarn
    },
    get fallbackRoot(): boolean {
      return _fallbackRoot
    },
    set fallbackRoot(val: boolean) {
      _fallbackRoot = val
    },
    get fallbackFormat(): boolean {
      return _fallbackFormat
    },
    set fallbackFormat(val: boolean) {
      _fallbackFormat = val
      _context.fallbackFormat = _fallbackFormat
    },
    get warnHtmlMessage(): boolean {
      return _warnHtmlMessage
    },
    set warnHtmlMessage(val: boolean) {
      _warnHtmlMessage = val
      _context.warnHtmlMessage = val
    },
    get escapeParameter(): boolean {
      return _escapeParameter
    },
    set escapeParameter(val: boolean) {
      _escapeParameter = val
      _context.escapeParameter = val
    },
    t,
    rt,
    d,
    n,
    te,
    tm,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [TransrateVNodeSymbol]: transrateVNode,
    [NumberPartsSymbol]: numberParts,
    [DatetimePartsSymbol]: datetimeParts,
    [SetPluralRulesSymbol]: setPluralRules
  }

  // for vue-devtools timeline event
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(composer as any)[EnableEmitter] = (emitter: VueDevToolsEmitter): void => {
      ;((_context as unknown) as CoreInternalContext).__v_emitter = emitter
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(composer as any)[DisableEmitter] = (): void => {
      ;((_context as unknown) as CoreInternalContext).__v_emitter = undefined
    }
  }

  return composer
}
