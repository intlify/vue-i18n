/* eslint-disable @typescript-eslint/no-explicit-any */
import { DEFAULT_LOCALE } from '@intlify/core-base'
import {
  assign,
  isArray,
  isBoolean,
  isFunction,
  isPlainObject,
  isRegExp,
  isString
} from '@intlify/shared'
import { createComposer, DefineLocaleMessage } from './composer'
import { DisableEmitter, EnableEmitter } from './symbols'

import type {
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  FallbackLocale,
  FallbackLocales,
  GeneratedLocale,
  IsEmptyObject,
  IsNever,
  LinkedModifiers,
  Locale,
  LocaleMessage,
  LocaleMessageDictionary,
  LocaleMessages,
  LocaleMessageValue,
  LocaleParams,
  MessageResolver,
  NamedValue,
  NumberFormat,
  NumberFormats as NumberFormatsType,
  Path,
  PickupFormatKeys,
  PickupFormatPathKeys,
  PickupKeys,
  PickupLocales,
  PickupPaths,
  PluralizationRule,
  PluralizationRules,
  PostTranslationHandler,
  RemovedIndexResources,
  RemoveIndexSignature,
  SchemaParams,
  TranslateOptions
} from '@intlify/core-base'
import type { VueDevToolsEmitter } from '@intlify/devtools-types'
import type {
  Composer,
  ComposerInternalOptions,
  ComposerOptions,
  ComposerResolveLocaleMessageTranslation,
  DefaultDateTimeFormatSchema,
  DefaultLocaleMessageSchema,
  DefaultNumberFormatSchema,
  DefineDateTimeFormat,
  DefineNumberFormat,
  MissingHandler,
  VueMessageType
} from './composer'
import type { Disposer } from './types'

/**
 * @deprecated will be removed at vue-i18n v12
 * @VueI18nLegacy
 */
export type TranslateResult = string
/**
 * @deprecated will be removed at vue-i18n v12
 * @VueI18nLegacy
 */
export type Choice = number
/**
 * @deprecated will be removed at vue-i18n v12
 * @VueI18nLegacy
 */
export type LocaleMessageObject<Message = string> =
  LocaleMessageDictionary<Message>
/**
 * @deprecated will be removed at vue-i18n v12
 * @VueI18nLegacy
 */
export type PluralizationRulesMap = { [locale: string]: PluralizationRule }
/**
 * @deprecated will be removed at vue-i18n v12
 * @VueI18nLegacy
 */
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'
/**
 * @deprecated will be removed at vue-i18n v12
 * @VueI18nLegacy
 */
export type DateTimeFormatResult = string
/**
 * @deprecated will be removed at vue-i18n v12
 * @VueI18nLegacy
 */
export type NumberFormatResult = string
/**
 * @deprecated will be removed at vue-i18n v12
 */
export type VueI18nExtender = (vueI18n: VueI18n) => Disposer | undefined

/**
 *  VueI18n Options
 *
 *  @remarks
 *  This option is compatible with `VueI18n` class constructor options (offered with Vue I18n v8.x)
 *
 * @deprecated will be removed at vue-i18n v12
 *
 *  @VueI18nLegacy
 */
export interface VueI18nOptions<
  Schema extends {
    message?: unknown
    datetime?: unknown
    number?: unknown
  } = {
    message: DefaultLocaleMessageSchema
    datetime: DefaultDateTimeFormatSchema
    number: DefaultNumberFormatSchema
  },
  Locales extends
    | {
        messages: unknown
        datetimeFormats: unknown
        numberFormats: unknown
      }
    | string = Locale,
  Options extends ComposerOptions<Schema, Locales> = ComposerOptions<
    Schema,
    Locales
  >
> {
  /**
   * @remarks
   * The locale of localization.
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   *
   * @defaultValue `'en-US'`
   */
  locale?: Options['locale']
  /**
   * @remarks
   * The locale of fallback localization.
   *
   * For more complex fallback definitions see fallback.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue The default `'en-US'` for the `locale` if it's not specified, or it's `locale` value
   */
  fallbackLocale?: Options['fallbackLocale']
  /**
   * @remarks
   * The locale messages of localization.
   *
   * @VueI18nSee [Getting Started](../guide/essentials/started)
   *
   * @defaultValue `{}`
   */
  messages?: Options['messages']
  /**
   * @remarks
   * Allow use flat json messages or not
   *
   * @defaultValue `false`
   */
  flatJson?: Options['flatJson']
  /**
   * @remarks
   * The datetime formats of localization.
   *
   * @VueI18nSee [Datetime Formatting](../guide/essentials/datetime)
   *
   * @defaultValue `{}`
   */
  datetimeFormats?: Options['datetimeFormats']
  /**
   * @remarks
   * The number formats of localization.
   *
   * @VueI18nSee [Number Formatting](../guide/essentials/number)
   *
   * @defaultValue `{}`
   */
  numberFormats?: Options['numberFormats']
  /**
   * @remarks
   * The list of available locales in messages in lexical order.
   *
   * @defaultValue `[]`
   */
  availableLocales?: Locale[]
  /**
   * @remarks
   * Custom Modifiers for linked messages.
   *
   * @VueI18nSee [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)
   */
  modifiers?: Options['modifiers']
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
  missing?: Options['missing']
  /**
   * @remarks
   * In the component localization, whether to fall back to root level (global scope) localization when localization fails.
   *
   * If `false`, it's not fallback to root.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `true`
   */
  fallbackRoot?: Options['fallbackRoot']
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   *
   * If `true`, suppress localization fail warnings.
   *
   * If you use regular expression, you can suppress localization fail warnings that it match with translation key (e.g. `t`).
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `false`
   */
  silentTranslationWarn?: Options['missingWarn']
  /**
   * @remarks
   * Whether do template interpolation on translation keys when your language lacks a translation for a key.
   *
   * If `true`, skip writing templates for your "base" language; the keys are your templates.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `false`
   */
  silentFallbackWarn?: Options['fallbackWarn']
  /**
   * @remarks
   * Whether suppress warnings when falling back to either `fallbackLocale` or root.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `false`
   */
  formatFallbackMessages?: Options['fallbackFormat']
  /**
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   *
   * See the warnHtmlInMessage property.
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   * @VueI18nSee [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)
   *
   * @defaultValue `'off'`
   */
  warnHtmlInMessage?: WarnHtmlInMessageLevel
  /**
   * @remarks
   * If `escapeParameterHtml` is configured as true then interpolation parameters are escaped before the message is translated.
   *
   * This is useful when translation output is used in `v-html` and the translation resource contains html markup (e.g. <b> around a user provided value).
   *
   * This usage pattern mostly occurs when passing precomputed text strings into UI components.
   *
   * The escape process involves replacing the following symbols with their respective HTML character entities: `<`, `>`, `"`, `'`.
   *
   * Setting `escapeParameterHtml` as true should not break existing functionality but provides a safeguard against a subtle type of XSS attack vectors.
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   *
   * @defaultValue `false`
   */
  escapeParameterHtml?: Options['escapeParameter']
  /**
   * @remarks
   * The shared locale messages of localization for components. More detail see Component based localization.
   *
   * @VueI18nSee [Shared locale messages for components](../guide/essentials/local#shared-locale-messages-for-components)
   *
   * @defaultValue `undefined`
   */
  sharedMessages?: LocaleMessages<VueMessageType>
  /**
   * @remarks
   * A set of rules for word pluralization
   *
   * @VueI18nSee [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)
   *
   * @defaultValue `{}`
   */
  pluralizationRules?: Options['pluralRules']
  /**
   * @remarks
   * A handler for post processing of translation. The handler gets after being called with the `$t`, and `t`.
   *
   * This handler is useful if you want to filter on translated text such as space trimming.
   *
   * @defaultValue `null`
   */
  postTranslation?: Options['postTranslation']
  /**
   * @remarks
   * Whether synchronize the root level locale to the component localization locale.
   *
   * If `false`, regardless of the root level locale, localize for each component locale.
   *
   * @VueI18nSee [Local Scope](../guide/essentials/scope#local-scope-2)
   *
   * @defaultValue `true`
   */
  sync?: boolean
  /**
   * @remarks
   * A message resolver to resolve [`messages`](legacy#messages).
   *
   * If not specified, the vue-i18n internal message resolver will be used by default.
   *
   * You need to implement a message resolver yourself that supports the following requirements:
   *
   * - Resolve the message using the locale message of [`locale`](legacy#locale) passed as the first argument of the message resolver, and the path passed as the second argument.
   *
   * - If the message could not be resolved, you need to return `null`.
   *
   * - If you will be returned `null`, the message resolver will also be called on fallback if [`fallbackLocale`](legacy#fallbacklocale-2) is enabled, so the message will need to be resolved as well.
   *
   * The message resolver is called indirectly by the following APIs:
   *
   * - [`t`](legacy#t-key)
   *
   * - [`te`](legacy#te-key-locale)
   *
   * - [`tm`](legacy#tm-key)
   *
   * - [Translation component](component#translation)
   *
   * @example
   * Here is an example of how to set it up using your `createI18n`:
   * ```js
   * import { createI18n } from 'vue-i18n'
   *
   * // your message resolver
   * function messageResolver(obj, path) {
   *   // simple message resolving!
   *   const msg = obj[path]
   *   return msg != null ? msg : null
   * }
   *
   * // call with I18n option
   * const i18n = createI18n({
   *   locale: 'ja',
   *   messageResolver, // set your message resolver
   *   messages: {
   *     en: { ... },
   *     ja: { ... }
   *   }
   * })
   *
   * // the below your something to do ...
   * // ...
   * ```
   *
   * @VueI18nTip
   * :new: v9.2+
   *
   * @VueI18nWarning
   * If you use the message resolver, the [`flatJson`](legacy#flatjson) setting will be ignored. That is, you need to resolve the flat JSON by yourself.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   *
   * @defaultValue `undefined`
   */
  messageResolver?: MessageResolver
}

/**
 * @internal
 *
 * @deprecated will be removed at vue-i18n v12
 */
export interface VueI18nInternalOptions {
  __extender?: VueI18nExtender
}

/**
 * Locale message translation functions for VueI18n legacy interfaces
 *
 * @remarks
 * This is the interface for {@link VueI18n}
 *
 * @deprecated will be removed at vue-i18n v12
 *
 * @VueI18nLegacy
 */
export interface VueI18nTranslation<
  Messages extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedLocaleMessage extends
    RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
  C = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<{
        [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
      }>
    : never,
  M = IsEmptyObject<Messages> extends false ? PickupKeys<Messages> : never,
  ResourceKeys extends C | M = IsNever<C> extends false
    ? IsNever<M> extends false
      ? C | M
      : C
    : IsNever<M> extends false
      ? M
      : never
> {
  /**
   * Locale message translation.
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [i18n component options](injection#i18n) is specified, it’s translated in preferentially local scope locale messages than global scope locale messages.
   *
   * If [i18n component options](injection#i18n) isn't specified, it’s translated with global scope locale messages.
   *
   * @param key - A target locale message key
   *
   * @returns Translated message
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   */
  <Key extends string>(key: Key | ResourceKeys): TranslateResult
  /**
   * Locale message translation for plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * In this overloaded `t`, return a pluralized translation message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   */
  <Key extends string>(key: Key | ResourceKeys, plural: number): TranslateResult
  /**
   * Locale message translation for plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
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
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    plural: number,
    options: TranslateOptions<Locales>
  ): TranslateResult
  /**
   * Locale message translation for missing default message
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * In this overloaded `t`, if no translation was found, return a default message.
   *
   * You can also suppress the warning, when the translation missing according to the options.
   *
   * @param key - A target locale message key
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    defaultMsg: string
  ): TranslateResult
  /**
   * Locale message translation for missing default message
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
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
  <Key extends string>(
    key: Key | ResourceKeys,
    defaultMsg: string,
    options: TranslateOptions<Locales>
  ): TranslateResult
  /**
   * Locale message translation.
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    list: unknown[]
  ): TranslateResult
  /**
   * Locale message translation for list interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    list: unknown[],
    plural: number
  ): TranslateResult
  /**
   * Locale message translation for list interpolations and missing default message
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * In this overloaded `t`, the locale messages should contain a `{0}`, `{1}`, … for each placeholder in the list, and if no translation was found, return a default message.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    list: unknown[],
    defaultMsg: string
  ): TranslateResult
  /**
   * Locale message translation for list interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
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
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    list: unknown[],
    options: TranslateOptions<Locales>
  ): TranslateResult
  /**
   * Locale message translation.
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    named: Record<string, unknown>
  ): TranslateResult
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and return a pluralized translation message.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param plural - Which plural string to get. 1 returns the first one.
   *
   * @returns Translated message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    named: NamedValue,
    plural: number
  ): TranslateResult
  /**
   * Locale message translation for named interpolations and plurals
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * In this overloaded `t`, for each placeholder x, the locale messages should contain a `{x}` token, and if no translation was found, return a default message.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   * @param defaultMsg - A default message to return if no translation was found
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    named: NamedValue,
    defaultMsg: string
  ): TranslateResult
  /**
   * Locale message translation for named interpolations
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
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
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    named: NamedValue,
    options: TranslateOptions<Locales>
  ): TranslateResult
}

/**
 * Resolve locale message translation functions for VueI18n legacy interfaces
 *
 * @deprecated will be removed at vue-i18n v12
 *
 * @remarks
 * This is the interface for {@link VueI18n}. This interface is an alias of {@link ComposerResolveLocaleMessageTranslation}.
 *
 * @VueI18nLegacy
 */
export type VueI18nResolveLocaleMessageTranslation<Locales = 'en-US'> =
  ComposerResolveLocaleMessageTranslation<Locales>

/**
 * Datetime formatting functions for VueI18n legacy interfaces
 *
 * @remarks
 * This is the interface for {@link VueI18n}
 *
 * @deprecated will be removed at vue-i18n v12
 *
 * @VueI18nLegacy
 */
export interface VueI18nDateTimeFormatting<
  DateTimeFormats extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedDateTimeFormat extends
    RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
  C = IsEmptyObject<DefinedDateTimeFormat> extends false
    ? PickupFormatPathKeys<{
        [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
      }>
    : never,
  M = IsEmptyObject<DateTimeFormats> extends false
    ? PickupFormatKeys<DateTimeFormats>
    : never,
  ResourceKeys extends C | M = IsNever<C> extends false
    ? IsNever<M> extends false
      ? C | M
      : C
    : IsNever<M> extends false
      ? M
      : never
> {
  /**
   * Datetime formatting
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [i18n component options](injection#i18n) is specified, it’s formatted in preferentially local scope datetime formats than global scope locale messages.
   *
   * If [i18n component options](injection#i18n) isn't specified, it’s formatted with global scope datetime formats.
   *
   * @param value - A value, timestamp number or `Date` instance
   *
   * @returns Formatted value
   *
   * @VueI18nSee [Datetime formatting](../guide/essentials/datetime)
   */
  (value: number | Date): DateTimeFormatResult
  /**
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [call signature](legacy#value-number-date-datetimeformatresult) details.
   *
   * @param value - A value, timestamp number or `Date` instance
   * @param key - A key of datetime formats
   *
   * @returns Formatted value
   */
  <Value extends number | Date = number, Key extends string = string>(
    value: Value,
    key: Key | ResourceKeys
  ): DateTimeFormatResult
  /**
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [call signature](legacy#value-number-date-datetimeformatresult) details.
   *
   * @param value - A value, timestamp number or `Date` instance
   * @param key - A key of datetime formats
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Formatted value
   */
  <Value extends number | Date = number, Key extends string = string>(
    value: Value,
    key: Key | ResourceKeys,
    locale: Locales
  ): DateTimeFormatResult
  /**
   * Datetime formatting
   *
   * @remarks
   * Overloaded `d`. About details, see the [call signature](legacy#value-number-date-datetimeformatresult) details.
   *
   * @param value - A value, timestamp number or `Date` instance
   * @param args - An argument values
   *
   * @returns Formatted value
   */
  (
    value: number | Date,
    args: { [key: string]: string | boolean | number }
  ): DateTimeFormatResult
}

/**
 * Number formatting functions for VueI18n legacy interfaces
 *
 * @remarks
 * This is the interface for {@link VueI18n}
 *
 * @deprecated will be removed at vue-i18n v12
 *
 * @VueI18nLegacy
 */
export interface VueI18nNumberFormatting<
  NumberFormats extends Record<string, any> = {},
  Locales = 'en-US',
  DefinedNumberFormat extends
    RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>,
  C = IsEmptyObject<DefinedNumberFormat> extends false
    ? PickupFormatPathKeys<{
        [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K]
      }>
    : never,
  M = IsEmptyObject<NumberFormats> extends false
    ? PickupFormatKeys<NumberFormats>
    : never,
  ResourceKeys extends C | M = IsNever<C> extends false
    ? IsNever<M> extends false
      ? C | M
      : C
    : IsNever<M> extends false
      ? M
      : never
> {
  /**
   * Number formatting
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [i18n component options](injection#i18n) is specified, it’s formatted in preferentially local scope number formats than global scope locale messages.
   *
   * If [i18n component options](injection#i18n) isn't specified, it’s formatted with global scope number formats.
   *
   * @param value - A number value
   *
   * @returns Formatted value
   *
   * @VueI18nSee [Number formatting](../guide/essentials/number)
   */
  (value: number): NumberFormatResult
  /**
   * Number formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [call signature](legacy#value-number-numberformatresult) details.
   *
   * @param value - A number value
   * @param key - A key of number formats
   *
   * @returns Formatted value
   */
  <Key extends string = string>(
    value: number,
    key: Key | ResourceKeys
  ): NumberFormatResult
  /**
   * Number formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [call signature](legacy#value-number-numberformatresult) details.
   *
   * @param value - A number value
   * @param key - A key of number formats
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Formatted value
   */
  <Key extends string = string>(
    value: number,
    key: Key | ResourceKeys,
    locale: Locales
  ): NumberFormatResult
  /**
   * Number formatting
   *
   * @remarks
   * Overloaded `n`. About details, see the [call signature](legacy#value-number-numberformatresult) details.
   *
   * @param value - A number value
   * @param args - An argument values
   *
   * @returns Formatted value
   */
  (
    value: number,
    args: { [key: string]: string | boolean | number }
  ): NumberFormatResult
}

/**
 *  VueI18n legacy interfaces
 *
 *  @remarks
 *  This interface is compatible with interface of `VueI18n` class (offered with Vue I18n v8.x).
 *
 * @deprecated will be removed at vue-i18n v12
 *
 *  @VueI18nLegacy
 */
export interface VueI18n<
  Messages extends Record<string, any> = {},
  DateTimeFormats extends Record<string, any> = {},
  NumberFormats extends Record<string, any> = {},
  OptionLocale = Locale,
  ResourceLocales =
    | PickupLocales<NonNullable<Messages>>
    | PickupLocales<NonNullable<DateTimeFormats>>
    | PickupLocales<NonNullable<NumberFormats>>,
  Locales = Locale extends GeneratedLocale
    ? GeneratedLocale
    : OptionLocale extends string
      ? [ResourceLocales] extends [never]
        ? Locale
        : ResourceLocales
      : OptionLocale | ResourceLocales,
  Composition extends Composer<
    Messages,
    DateTimeFormats,
    NumberFormats,
    OptionLocale
  > = Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
> {
  /**
   * @remarks
   * Instance ID.
   */
  id: number
  /**
   * @remarks
   * The current locale this VueI18n instance is using.
   *
   * If the locale contains a territory and a dialect, this locale contains an implicit fallback.
   *
   * @VueI18nSee [Scope and Locale Changing](../guide/essentials/scope)
   */
  // locale: Locales
  locale: Locales
  /**
   * @remarks
   * The current fallback locales this VueI18n instance is using.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  fallbackLocale: FallbackLocales<Locales>
  /**
   * @remarks
   * The list of available locales in `messages` in lexical order.
   */
  readonly availableLocales: Composition['availableLocales']
  /**
   * @remarks
   * The locale messages of localization.
   *
   * @VueI18nSee [Getting Started](../guide/essentials/started)
   */
  readonly messages: { [K in keyof Messages]: Messages[K] }
  /**
   * @remarks
   * The datetime formats of localization.
   *
   * @VueI18nSee [Datetime Formatting](../guide/essentials/datetime)
   */
  readonly datetimeFormats: { [K in keyof DateTimeFormats]: DateTimeFormats[K] }
  /**
   * @remarks
   * The number formats of localization.
   *
   * @VueI18nSee [Number Formatting](../guide/essentials/number)
   */
  readonly numberFormats: { [K in keyof NumberFormats]: NumberFormats[K] }
  /**
   * @remarks
   * Custom Modifiers for linked messages.
   *
   * @VueI18nSee [Custom Modifiers](../guide/essentials/syntax#custom-modifiers)
   */
  readonly modifiers: Composition['modifiers']
  /**
   * @remarks
   * A handler for localization missing.
   */
  missing: MissingHandler | null
  /**
   * @remarks
   * A handler for post processing of translation.
   */
  postTranslation: PostTranslationHandler<VueMessageType> | null
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  silentTranslationWarn: Composition['missingWarn']
  /**
   * @remarks
   * Whether suppress fallback warnings when localization fails.
   */
  silentFallbackWarn: Composition['fallbackWarn']
  /**
   * @remarks
   * Whether suppress warnings when falling back to either `fallbackLocale` or root.
   *
   * @VueI18nSee [Fallbacking](../guide/essentials/fallback)
   */
  formatFallbackMessages: Composition['fallbackFormat']
  /**
   * @remarks
   * Whether synchronize the root level locale to the component localization locale.
   *
   * @VueI18nSee [Local Scope](../guide/essentials/scope#local-scope-2)
   */
  sync: Composition['inheritLocale']
  /**
   * @remarks
   * Whether to allow the use locale messages of HTML formatting.
   *
   * If you set `warn` or` error`, will check the locale messages on the VueI18n instance.
   *
   * If you are specified `warn`, a warning will be output at console.
   *
   * If you are specified `error` will occurred an Error.
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   * @VueI18nSee [Change `warnHtmlInMessage` option default value](../guide/migration/breaking#change-warnhtmlinmessage-option-default-value)
   */
  warnHtmlInMessage: WarnHtmlInMessageLevel
  /**
   * @remarks
   * Whether interpolation parameters are escaped before the message is translated.
   *
   * @VueI18nSee [HTML Message](../guide/essentials/syntax#html-message)
   */
  escapeParameterHtml: Composition['escapeParameter']
  /**
   * A set of rules for word pluralization
   *
   * @VueI18nSee [Custom Pluralization](../guide/essentials/pluralization#custom-pluralization)
   */
  pluralizationRules: Composition['pluralRules']
  /**
   * Locale message translation
   *
   * @remarks
   * About details functions, See the {@link VueI18nTranslation}
   */
  t: VueI18nTranslation<
    Messages,
    Locales,
    RemoveIndexSignature<{
      [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
    }>
  >
  /**
   * Resolve locale message translation
   *
   * @remarks
   * About details functions, See the {@link VueI18nResolveLocaleMessageTranslation}
   */
  rt: VueI18nResolveLocaleMessageTranslation<Locales>
  /**
   * Translation locale message exist
   *
   * @remarks
   * whether do exist locale message on VueI18n instance [messages](legacy#messages).
   *
   * If you specified `locale`, check the locale messages of `locale`.
   *
   * @param key - A target locale message key
   * @param locale - A target locale
   *
   * @returns If found locale message, `true`, else `false`
   */
  te<
    Str extends string,
    Key extends PickupKeys<Messages> = PickupKeys<Messages>
  >(
    key: Str | Key,
    locale?: Locales
  ): boolean
  /**
   * Locale messages getter
   *
   * @remarks
   * If [i18n component options](injection#i18n) is specified, it’s get in preferentially local scope locale messages than global scope locale messages.
   *
   * If [i18n component options](injection#i18n) isn't specified, it’s get with global scope locale messages.
   *
   * Based on the current `locale`, locale messages will be returned from Composer instance messages.
   *
   * If you change the `locale`, the locale messages returned will also correspond to the locale.
   *
   * If there are no locale messages for the given `key` in the composer instance messages, they will be returned with [fallbacking](../guide/essentials/fallback).
   *
   * @VueI18nWarning
   * You need to use `rt` for the locale message returned by `tm`. see the [rt](legacy#rt-message) details.
   *
   * @example
   * template:
   * ```html
   * <div class="container">
   *   <template v-for="content in $tm('contents')">
   *     <h2>{{ $rt(content.title) }}</h2>
   *     <p v-for="paragraph in content.paragraphs">
   *      {{ $rt(paragraph) }}
   *     </p>
   *   </template>
   * </div>
   * ```
   *
   * ```js
   * import { createI18n } from 'vue-i18n'
   *
   * const i18n = createI18n({
   *   messages: {
   *     en: {
   *       contents: [
   *         {
   *           title: 'Title1',
   *           // ...
   *           paragraphs: [
   *             // ...
   *           ]
   *         }
   *       ]
   *     }
   *   }
   *   // ...
   * })
   * ```
   * @param key - A target locale message key
   *
   * @return Locale messages
   */
  tm: Composition['tm']
  /**
   * Get locale message
   *
   * @remarks
   * get locale message from VueI18n instance [messages](legacy#messages).
   *
   * @param locale - A target locale
   *
   * @returns Locale messages
   */
  getLocaleMessage: Composition['getLocaleMessage']
  /**
   * Set locale message
   *
   * @remarks
   * Set locale message to VueI18n instance [messages](legacy#messages).
   *
   * @param locale - A target locale
   * @param message - A message
   */
  setLocaleMessage: Composition['setLocaleMessage']
  /**
   * Merge locale message
   *
   * @remarks
   * Merge locale message to VueI18n instance [messages](legacy#messages).
   *
   * @param locale - A target locale
   * @param message - A message
   */
  mergeLocaleMessage: Composition['mergeLocaleMessage']
  /**
   * Datetime formatting
   *
   * @remarks
   * About details functions, See the {@link VueI18nDateTimeFormatting}
   */
  d: VueI18nDateTimeFormatting<
    DateTimeFormats,
    Locales,
    RemoveIndexSignature<{
      [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
    }>
  >
  /**
   * Get datetime format
   *
   * @remarks
   * get datetime format from VueI18n instance [datetimeFormats](legacy#datetimeformats).
   *
   * @param locale - A target locale
   *
   * @returns Datetime format
   */
  getDateTimeFormat: Composition['getDateTimeFormat']
  /**
   * Set datetime format
   *
   * @remarks
   * Set datetime format to VueI18n instance [datetimeFormats](legacy#datetimeformats).
   *
   * @param locale - A target locale
   * @param format - A target datetime format
   */
  setDateTimeFormat: Composition['setDateTimeFormat']
  /**
   * Merge datetime format
   *
   * @remarks
   * Merge datetime format to VueI18n instance [datetimeFormats](legacy#datetimeformats).
   *
   * @param locale - A target locale
   * @param format - A target datetime format
   */
  mergeDateTimeFormat: Composition['mergeDateTimeFormat']
  /**
   * Number Formatting
   *
   * @remarks
   * About details functions, See the {@link VueI18nNumberFormatting}
   */
  n: VueI18nNumberFormatting<
    NumberFormats,
    Locales,
    RemoveIndexSignature<{
      [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
    }>
  >
  /**
   * Get number format
   *
   * @remarks
   * get number format from VueI18n instance [numberFormats](legacy#numberFormats).
   *
   * @param locale - A target locale
   *
   * @returns Number format
   */
  getNumberFormat: Composition['getNumberFormat']
  /**
   * Set number format
   *
   * @remarks
   * Set number format to VueI18n instance [numberFormats](legacy#numberFormats).
   *
   * @param locale - A target locale
   * @param format - A target number format
   */
  setNumberFormat: Composition['setNumberFormat']
  /**
   * Merge number format
   *
   * @remarks
   * Merge number format to VueI18n instance [numberFormats](legacy#numberFormats).
   *
   * @param locale - A target locale
   * @param format - A target number format
   */
  mergeNumberFormat: Composition['mergeNumberFormat']
}

/**
 * @internal
 *
 * @deprecated will be removed at vue-i18n v12
 */
export interface VueI18nInternal<
  Messages extends Record<string, any> = {},
  DateTimeFormats extends Record<string, any> = {},
  NumberFormats extends Record<string, any> = {}
> {
  __composer: Composer<Messages, DateTimeFormats, NumberFormats>
  __enableEmitter?: (emitter: VueDevToolsEmitter) => void
  __disableEmitter?: () => void
  __extender?: VueI18nExtender
  __disposer?: Disposer
}

/**
 * Convert to I18n Composer Options from VueI18n Options
 *
 * @internal
 */
function convertComposerOptions<
  Messages extends Record<string, any> = {},
  DateTimeFormats extends Record<string, any> = {},
  NumberFormats extends Record<string, any> = {}
>(
  options: VueI18nOptions &
    ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats>
): ComposerOptions &
  ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats> {
  const locale = isString(options.locale) ? options.locale : DEFAULT_LOCALE
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
  const modifiers = isPlainObject(options.modifiers) ? options.modifiers : {}
  const pluralizationRules = options.pluralizationRules
  const postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : undefined
  const warnHtmlMessage = isString(options.warnHtmlInMessage)
    ? options.warnHtmlInMessage !== 'off'
    : true
  const escapeParameter = !!options.escapeParameterHtml
  const inheritLocale = isBoolean(options.sync) ? options.sync : true

  let messages = options.messages
  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages
    const locales: Locale[] = Object.keys(sharedMessages)
    messages = locales.reduce(
      (messages, locale) => {
        const message = messages[locale] || (messages[locale] = {})
        assign(message, sharedMessages[locale])
        return messages
      },
      (messages || {}) as LocaleMessages<LocaleMessage<VueMessageType>>
    )
  }
  const { __i18n, __root, __injectWithOption } = options

  const datetimeFormats = options.datetimeFormats
  const numberFormats = options.numberFormats
  const flatJson = options.flatJson

  return {
    locale,
    fallbackLocale,
    messages,
    flatJson,
    datetimeFormats,
    numberFormats,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackRoot,
    fallbackFormat,
    modifiers,
    pluralRules: pluralizationRules,
    postTranslation,
    warnHtmlMessage,
    escapeParameter,
    messageResolver: options.messageResolver,
    inheritLocale,
    __i18n,
    __root,
    __injectWithOption
  }
}

export function createVueI18n<
  Options extends VueI18nOptions = VueI18nOptions,
  Messages extends Record<string, any> = Options['messages'] extends Record<
    string,
    any
  >
    ? Options['messages']
    : {},
  DateTimeFormats extends Record<
    string,
    any
  > = Options['datetimeFormats'] extends Record<string, any>
    ? Options['datetimeFormats']
    : {},
  NumberFormats extends Record<
    string,
    any
  > = Options['numberFormats'] extends Record<string, any>
    ? Options['numberFormats']
    : {}
>(options?: Options): VueI18n<Messages, DateTimeFormats, NumberFormats>

export function createVueI18n<
  Schema extends object = DefaultLocaleMessageSchema,
  Locales extends string | object = 'en-US',
  Options extends VueI18nOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  > = VueI18nOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  >,
  Messages extends Record<string, any> = NonNullable<
    Options['messages']
  > extends Record<string, any>
    ? NonNullable<Options['messages']>
    : {},
  DateTimeFormats extends Record<string, any> = NonNullable<
    Options['datetimeFormats']
  > extends Record<string, any>
    ? NonNullable<Options['datetimeFormats']>
    : {},
  NumberFormats extends Record<string, any> = NonNullable<
    Options['numberFormats']
  > extends Record<string, any>
    ? NonNullable<Options['numberFormats']>
    : {}
>(options?: Options): VueI18n<Messages, DateTimeFormats, NumberFormats>

/**
 * create VueI18n interface factory
 *
 * @internal
 *
 * @deprecated will be removed at vue-i18n v12
 */

export function createVueI18n(options: any = {}): any {
  type Message = VueMessageType

  const composer = createComposer(convertComposerOptions(options)) as Composer
  const { __extender } = options as unknown as VueI18nInternalOptions

  // defines VueI18n
  const vueI18n = {
    // id
    id: composer.id,

    // locale
    get locale(): Locale {
      return composer.locale.value as Locale
    },
    set locale(val: Locale) {
      composer.locale.value = val as any
    },

    // fallbackLocale
    get fallbackLocale(): FallbackLocale {
      return composer.fallbackLocale.value as FallbackLocale
    },
    set fallbackLocale(val: FallbackLocale) {
      composer.fallbackLocale.value = val as any
    },

    // messages
    get messages(): LocaleMessages<Message> {
      return composer.messages.value
    },

    // datetimeFormats
    get datetimeFormats(): DateTimeFormatsType {
      return composer.datetimeFormats.value
    },

    // numberFormats
    get numberFormats(): NumberFormatsType {
      return composer.numberFormats.value
    },

    // availableLocales
    get availableLocales(): Locale[] {
      return composer.availableLocales as Locale[]
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

    // modifiers
    get modifiers(): LinkedModifiers<Message> {
      return composer.modifiers
    },

    // formatFallbackMessages
    get formatFallbackMessages(): boolean {
      return composer.fallbackFormat
    },
    set formatFallbackMessages(val: boolean) {
      composer.fallbackFormat = val
    },

    // postTranslation
    get postTranslation(): PostTranslationHandler<Message> | null {
      return composer.getPostTranslationHandler()
    },
    set postTranslation(handler: PostTranslationHandler<Message> | null) {
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

    // escapeParameterHtml
    get escapeParameterHtml(): boolean {
      return composer.escapeParameter
    },
    set escapeParameterHtml(val: boolean) {
      composer.escapeParameter = val
    },

    // pluralizationRules
    get pluralizationRules(): PluralizationRules {
      return composer.pluralRules || {}
    },

    // for internal
    __composer: composer,

    // t
    t(...args: unknown[]): TranslateResult {
      return Reflect.apply(composer.t, composer, [...args])
    },

    // rt
    rt(...args: unknown[]): TranslateResult {
      return Reflect.apply(composer.rt, composer, [...args])
    },

    // te
    te(key: Path, locale?: Locale): boolean {
      return composer.te(key, locale)
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

    // mergeLocaleMessage
    mergeLocaleMessage(
      locale: Locale,
      message: LocaleMessageDictionary<VueMessageType>
    ): void {
      composer.mergeLocaleMessage(locale, message as any)
    },

    // d
    d(...args: unknown[]): DateTimeFormatResult {
      return Reflect.apply(composer.d, composer, [...args])
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
      return Reflect.apply(composer.n, composer, [...args])
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
    }
  }

  // custom extender for vue-i18n-routing and nuxt i18n
  ;(vueI18n as unknown as VueI18nInternal).__extender = __extender

  // for vue-devtools timeline event
  if (__DEV__) {
    ;(vueI18n as unknown as VueI18nInternal).__enableEmitter = (
      emitter: VueDevToolsEmitter
    ): void => {
      const __composer = composer as any
      __composer[EnableEmitter] && __composer[EnableEmitter](emitter)
    }
    ;(vueI18n as unknown as VueI18nInternal).__disableEmitter = (): void => {
      const __composer = composer as any
      __composer[DisableEmitter] && __composer[DisableEmitter]()
    }
  }

  return vueI18n
}

/* eslint-enable @typescript-eslint/no-explicit-any */
