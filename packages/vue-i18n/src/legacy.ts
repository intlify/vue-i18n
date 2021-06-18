/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EnableEmitter,
  DisableEmitter,
  createComposer,
  DefineLocaleMessage
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
  assign,
  warn
} from '@intlify/shared'

import type {
  Path,
  MessageResolver,
  PluralizationRule,
  PluralizationRules,
  LinkedModifiers,
  NamedValue,
  Locale,
  LocaleMessage,
  LocaleMessages,
  LocaleMessageDictionary,
  PostTranslationHandler,
  FallbackLocale,
  LocaleMessageValue,
  TranslateOptions,
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
  DateTimeFormat,
  NumberFormat,
  PickupKeys,
  PickupFormatKeys,
  PickupLocales,
  SchemaParams,
  LocaleParams,
  RemoveIndexSignature,
  FallbackLocales,
  PickupPaths,
  PickupFormatPathKeys,
  IsEmptyObject,
  IsNever
} from '@intlify/core-base'
import type { VueDevToolsEmitter } from '@intlify/vue-devtools'
import type {
  VueMessageType,
  RemovedIndexResources,
  DefaultLocaleMessageSchema,
  DefineDateTimeFormat,
  DefaultDateTimeFormatSchema,
  DefineNumberFormat,
  DefaultNumberFormatSchema,
  MissingHandler,
  Composer,
  ComposerOptions,
  ComposerInternalOptions,
  ComposerResolveLocaleMessageTranslation
} from './composer'

/** @VueI18nLegacy */
export type TranslateResult = string
export type Choice = number
/** @VueI18nLegacy */
export type LocaleMessageObject<
  Message = string
> = LocaleMessageDictionary<Message>
export type PluralizationRulesMap = { [locale: string]: PluralizationRule }
export type WarnHtmlInMessageLevel = 'off' | 'warn' | 'error'
/** @VueI18nLegacy */
export type DateTimeFormatResult = string
/** @VueI18nLegacy */
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
 *  This option is compatible with `VueI18n` class constructor options (offered with Vue I18n v8.x)
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
   * @VueI18nSee [Getting Started](../guide/)
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
   * The formatter that implemented with Formatter interface.
   *
   * @deprecated See the [here](../guide/migration/breaking#remove-custom-formatter)
   */
  formatter?: Formatter
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
   * Whether `v-t` directive's element should preserve `textContent` after directive is unbinded.
   *
   * @VueI18nSee [Custom Directive](../guide/advanced/directive)
   * @VueI18nSee [Remove `preserveDirectiveContent` option](../guide/migration/breaking#remove-preservedirectivecontent-option)
   *
   * @defaultValue `false`
   *
   * @deprecated The `v-t` directive for Vue 3 now preserves the default content. Therefore, this option and its properties have been removed from the VueI18n instance.
   */
  preserveDirectiveContent?: boolean
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
   * A handler for post processing of translation. The handler gets after being called with the `$t`, `t`, `$tc`, and `tc`.
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
   * A handler for getting notified when component-local instance was created.
   *
   * The handler gets called with new and old (root) VueI18n instances.
   *
   * This handler is useful when extending the root VueI18n instance and wanting to also apply those extensions to component-local instance.
   *
   * @defaultValue `null`
   */
  componentInstanceCreatedListener?: ComponentInstanceCreatedListener
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
   * - [`tc`](legacy#tc-key)
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
 * Locale message translation functions for VueI18n legacy interfaces
 *
 * @remarks
 * This is the interface for {@link VueI18n}
 *
 * @VueI18nLegacy
 */
export interface VueI18nTranslation<
  Messages = {},
  Locales = 'en-US',
  DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
  C = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<
        {
          [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
        }
      >
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
   * Locale message translation.
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * @param key - A target locale message key
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Translated message
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    locale: Locales | Locale
  ): TranslateResult
  /**
   * Locale message translation.
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * @param key - A target locale message key
   * @param locale - A locale, it will be used over than global scope or local scope.
   * @param list - A values of list interpolation
   *
   * @returns Translated message
   *
   * @VueI18nSee [List interpolation](../guide/essentials/syntax#list-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    locale: Locales | Locale,
    list: unknown[]
  ): TranslateResult
  /**
   * Locale message translation.
   *
   * @remarks
   * Overloaded `t`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult) details.
   *
   * @param key - A target locale message key
   * @param locale - A locale, it will be used over than global scope or local scope.
   * @param named - A values of named interpolation
   *
   * @returns Translated message
   *
   * @VueI18nSee [Named interpolation](../guide/essentials/syntax#named-interpolation)
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    locale: Locales | Locale,
    named: Record<string, unknown>
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
}

/**
 * Resolve locale message translation functions for VueI18n legacy interfaces
 *
 * @remarks
 * This is the interface for {@link VueI18n}. This interfce is an alias of {@link ComposerResolveLocaleMessageTranslation}.
 *
 * @VueI18nLegacy
 */
export type VueI18nResolveLocaleMessageTranslation<
  Locales = 'en-US'
> = ComposerResolveLocaleMessageTranslation<Locales>

/**
 * Locale message pluralization functions for VueI18n legacy interfaces
 *
 * @remarks
 * This is the interface for {@link VueI18n}
 *
 * @VueI18nLegacy
 */
export interface VueI18nTranslationChoice<
  Messages = {},
  Locales = 'en-US',
  DefinedLocaleMessage extends RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
  C = IsEmptyObject<DefinedLocaleMessage> extends false
    ? PickupPaths<
        {
          [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
        }
      >
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
   * Locale message pluralization
   *
   * @remarks
   * If this is used in a reactive context, it will re-evaluate once the locale changes.
   *
   * If [i18n component options](injection#i18n) is specified, it’s pluraled in preferentially local scope locale messages than global scope locale messages.
   *
   * If [i18n component options](injection#i18n) isn't specified, it’s pluraled with global scope locale messages.
   *
   * The plural choice number is handled with default `1`.
   *
   * @param key - A target locale message key
   *
   * @returns Pluraled message
   *
   * @VueI18nSee [Pluralization](../guide/essentials/pluralization)
   */
  <Key extends string = string>(key: Key | ResourceKeys): TranslateResult
  /**
   * Locale message pluralization
   *
   * @remarks
   * Overloaded `tc`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult-2) details.
   *
   * @param key - A target locale message key
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Pluraled message
   */
  <Key extends string = string>(
    key: Key | ResourceKeys,
    locale: Locales | Locale
  ): TranslateResult
  /**
   * Locale message pluralization
   *
   * @remarks
   * Overloaded `tc`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult-2) details.
   *
   * @param key - A target locale message key
   * @param list - A values of list interpolation
   *
   * @returns Pluraled message
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    list: unknown[]
  ): TranslateResult
  /**
   * Locale message pluralization
   *
   * @remarks
   * Overloaded `tc`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult-2) details.
   *
   * @param key - A target locale message key
   * @param named - A values of named interpolation
   *
   * @returns Pluraled message
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    named: Record<string, unknown>
  ): TranslateResult
  /**
   * Locale message pluralization
   *
   * @remarks
   * Overloaded `tc`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult-2) details.
   *
   * @param key - A target locale message key
   * @param choice - Which plural string to get. 1 returns the first one.
   *
   * @returns Pluraled message
   */
  <Key extends string>(key: Key | ResourceKeys, choice: number): TranslateResult
  /**
   * Locale message pluralization
   *
   * @remarks
   * Overloaded `tc`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult-2) details.
   *
   * @param key - A target locale message key
   * @param choice - Which plural string to get. 1 returns the first one.
   * @param locale - A locale, it will be used over than global scope or local scope.
   *
   * @returns Pluraled message
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    choice: number,
    locale: Locales | Locale
  ): TranslateResult
  /**
   * Locale message pluralization
   *
   * @remarks
   * Overloaded `tc`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult-2) details.
   *
   * @param key - A target locale message key
   * @param choice - Which plural string to get. 1 returns the first one.
   * @param list - A values of list interpolation
   *
   * @returns Pluraled message
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    choice: number,
    list: unknown[]
  ): TranslateResult
  /**
   * Locale message pluralization
   *
   * @remarks
   * Overloaded `tc`. About details, see the [call signature](legacy#key-key-resourcekeys-translateresult-2) details.
   *
   * @param key - A target locale message key
   * @param choice - Which plural string to get. 1 returns the first one.
   * @param named - A values of named interpolation
   *
   * @returns Pluraled message
   */
  <Key extends string>(
    key: Key | ResourceKeys,
    choice: number,
    named: Record<string, unknown>
  ): TranslateResult
}

/**
 * Datetime formatting functions for VueI18n legacy interfaces
 *
 * @remarks
 * This is the interface for {@link VueI18n}
 *
 * @VueI18nLegacy
 */
export interface VueI18nDateTimeFormatting<
  DateTimeFormats = {},
  Locales = 'en-US',
  DefinedDateTimeFormat extends RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
  C = IsEmptyObject<DefinedDateTimeFormat> extends false
    ? PickupFormatPathKeys<
        {
          [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
        }
      >
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
 * @VueI18nLegacy
 */
export interface VueI18nNumberFormatting<
  NumberFormats = {},
  Locales = 'en-US',
  DefinedNumberFormat extends RemovedIndexResources<DefineNumberFormat> = RemovedIndexResources<DefineNumberFormat>,
  C = IsEmptyObject<DefinedNumberFormat> extends false
    ? PickupFormatPathKeys<
        {
          [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K]
        }
      >
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
 *  @VueI18nLegacy
 */
export interface VueI18n<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  OptionLocale = Locale,
  ResourceLocales =
    | PickupLocales<NonNullable<Messages>>
    | PickupLocales<NonNullable<DateTimeFormats>>
    | PickupLocales<NonNullable<NumberFormats>>,
  Locales = OptionLocale extends string
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
   * @VueI18nSee [Getting Started](../guide/)
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
   * The formatter that implemented with Formatter interface.
   *
   * @deprecated See the [here](../guide/migration/breaking#remove-custom-formatter)
   */
  formatter: Formatter
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
   * @remarks
   * Whether `v-t` directive's element should preserve `textContent` after directive is unbinded.
   *
   * @VueI18nSee [Custom Directive](../guide/advanced/directive)
   * @VueI18nSee [Remove preserveDirectiveContent option](../guide/migration/breaking#remove-preservedirectivecontent-option)
   *
   * @deprecated The `v-t` directive for Vue 3 now preserves the default content. Therefore, this option and its properties have been removed from the VueI18n instance.
   */
  preserveDirectiveContent: boolean
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
    RemoveIndexSignature<
      {
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
      }
    >
  >
  /**
   * Resolve locale message translation
   *
   * @remarks
   * About details functions, See the {@link VueI18nResolveLocaleMessageTranslation}
   */
  rt: VueI18nResolveLocaleMessageTranslation<Locales>
  /**
   * Locale message pluralization
   *
   * @remarks
   * About details functions, See the {@link VueI18nTranslationChoice}
   */
  tc: VueI18nTranslationChoice<
    Messages,
    Locales,
    RemoveIndexSignature<
      {
        [K in keyof DefineLocaleMessage]: DefineLocaleMessage[K]
      }
    >
  >
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
    RemoveIndexSignature<
      {
        [K in keyof DefineDateTimeFormat]: DefineDateTimeFormat[K]
      }
    >
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
    RemoveIndexSignature<
      {
        [K in keyof DefineNumberFormat]: DefineNumberFormat[K]
      }
    >
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
  /**
   * Get choice index
   *
   * @remarks
   * Get pluralization index for current pluralizing number and a given amount of choices.
   *
   * @deprecated Use `pluralizationRules` option instead of `getChoiceIndex`.
   */
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
  __composer: Composer<Messages, DateTimeFormats, NumberFormats>
  __onComponentInstanceCreated(
    target: VueI18n<Messages, DateTimeFormats, NumberFormats>
  ): void
  __enableEmitter?: (emitter: VueDevToolsEmitter) => void
  __disableEmitter?: () => void
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

  if (__DEV__ && options.formatter) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_FORMATTER))
  }

  if (__DEV__ && options.preserveDirectiveContent) {
    warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_PRESERVE_DIRECTIVE))
  }

  let messages = options.messages
  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages
    const locales: Locale[] = Object.keys(sharedMessages)
    messages = locales.reduce((messages, locale) => {
      const message = messages[locale] || (messages[locale] = {})
      assign(message, sharedMessages[locale])
      return messages
    }, (messages || {}) as LocaleMessages<LocaleMessage<VueMessageType>>)
  }
  const { __i18n, __root } = options

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
    __root
  }
}

export function createVueI18n<
  Options extends VueI18nOptions = VueI18nOptions,
  Messages = Options['messages'] extends object ? Options['messages'] : {},
  DateTimeFormats = Options['datetimeFormats'] extends object
    ? Options['datetimeFormats']
    : {},
  NumberFormats = Options['numberFormats'] extends object
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
  Messages = Options['messages'] extends object ? Options['messages'] : {},
  DateTimeFormats = Options['datetimeFormats'] extends object
    ? Options['datetimeFormats']
    : {},
  NumberFormats = Options['numberFormats'] extends object
    ? Options['numberFormats']
    : {}
>(options?: Options): VueI18n<Messages, DateTimeFormats, NumberFormats>

/**
 * create VueI18n interface factory
 *
 * @internal
 */
export function createVueI18n(options: any = {}): any {
  type Message = VueMessageType
  const composer = createComposer(convertComposerOptions(options)) as Composer

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

    // pluralizationRules
    get pluralizationRules(): PluralizationRules {
      return composer.pluralRules || {}
    },

    // for internal
    __composer: composer,

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

      // return composer.t(key, (list || named || {}) as any, options)
      return Reflect.apply(composer.t, composer, [
        key,
        (list || named || {}) as any,
        options
      ])
    },

    rt(...args: unknown[]): TranslateResult {
      return Reflect.apply(composer.rt, composer, [...args])
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

      // return composer.t(key, (list || named || {}) as any, options)
      return Reflect.apply(composer.t, composer, [
        key,
        (list || named || {}) as any,
        options
      ])
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
    },

    // getChoiceIndex
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getChoiceIndex(choice: Choice, choicesLength: number): number {
      __DEV__ &&
        warn(getWarnMessage(I18nWarnCodes.NOT_SUPPORTED_GET_CHOICE_INDEX))
      return -1
    },

    // for internal
    __onComponentInstanceCreated(target: VueI18n<Message>): void {
      const { componentInstanceCreatedListener } = options
      if (componentInstanceCreatedListener) {
        componentInstanceCreatedListener(target, vueI18n)
      }
    }
  }

  // for vue-devtools timeline event
  if (__DEV__) {
    ;((vueI18n as unknown) as VueI18nInternal).__enableEmitter = (
      emitter: VueDevToolsEmitter
    ): void => {
      const __composer = composer as any
      __composer[EnableEmitter] && __composer[EnableEmitter](emitter)
    }
    ;((vueI18n as unknown) as VueI18nInternal).__disableEmitter = (): void => {
      const __composer = composer as any
      __composer[DisableEmitter] && __composer[DisableEmitter]()
    }
  }

  return vueI18n
}

/* eslint-enable @typescript-eslint/no-explicit-any */
