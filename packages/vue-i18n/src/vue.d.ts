import type {
  DateTimeOptions,
  IsEmptyObject,
  IsNever,
  Locale,
  LocaleMessageValue,
  MessageFunction,
  NamedValue,
  NumberOptions,
  PickupFormatPathKeys,
  TranslateOptions
} from '@intlify/core-base'
import type {
  CustomBlocks,
  DatetimeFormat,
  DefineDateTimeFormat,
  DefineLocaleMessage,
  ExportedGlobalComposer,
  NumberFormat,
  RemovedIndexResources,
  Translation,
  VueMessageType
} from '@intlify/vue-i18n-core'

// --- THE CONTENT BELOW THIS LINE WILL BE APPENDED TO DTS FILE IN DIST DIRECTORY --- //

import type { JsonPaths } from '@intlify/core-base'

type IsPart<O> = O extends { part: infer P } ? P : false

declare module 'vue' {
  /**
   * Component Custom Options for Vue I18n
   *
   * @VueI18nInjection
   */
  export interface ComponentCustomOptions {
    /**
     * For custom blocks options
     * @internal
     */
    __i18n?: CustomBlocks
    /**
     * For devtools
     * @internal
     */
    __INTLIFY_META__?: string
  }

  /**
   * Component Custom Properties for Vue I18n
   *
   * @VueI18nInjection
   */
  export interface ComponentCustomProperties {
    /**
     * Exported Global Composer instance
     *
     * @remarks
     * You can get the {@link ExportedGlobalComposer | exported composer instance} which are exported from global {@link Composer | composer instance} created with {@link createI18n}
     * You can get the exported composer instance in {@link I18nMode | Composition API mode}
     * The locales, locale messages, and other resources managed by the instance referenced by this property are valid as global scope.
     * If the `i18n` component custom option is not specified, it's the same as the VueI18n instance that can be referenced by the i18n instance {@link I18n.global | global} property.
     */
    $i18n: ExportedGlobalComposer
    /**
     * Locale message translation
     *
     * @remarks
     * If this is used in a reactive context, it will re-evaluate once the locale changes.
     *
     * In {@link I18nMode | Composition API mode}, the `$t` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer, and it work on **global scope**. About that details, see {@link Composer#t | `Composer#t` }.
     *
     * @param key - A target locale message key
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param plural - A choice number of plural
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      plural: number
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param plural - Which plural string to get. 1 returns the first one.
     * @param options - An options, see the {@link TranslateOptions}
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      plural: number,
      options: TranslateOptions
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param defaultMsg - A default message to return if no translation was found
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      defaultMsg: string
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param defaultMsg - A default message to return if no translation was found
     * @param options - An options, see the {@link TranslateOptions}
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      defaultMsg: string,
      options: TranslateOptions
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param list - A values of list interpolation
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      list: unknown[]
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param list - A values of list interpolation
     * @param plural - A choice number of plural
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      list: unknown[],
      plural: number
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param list - A values of list interpolation
     * @param defaultMsg - A default message to return if no translation was found
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      list: unknown[],
      defaultMsg: string
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param list - A values of list interpolation
     * @param options - An options, see the {@link TranslateOptions}
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      list: unknown[],
      options: TranslateOptions
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param named - A values of named interpolation
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      named: NamedValue
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param named - A values of named interpolation
     * @param plural - A choice number of plural
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      named: NamedValue,
      plural: number
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param named - A values of named interpolation
     * @param defaultMsg - A default message to return if no translation was found
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      named: NamedValue,
      defaultMsg: string
    ): string
    /**
     * Locale message translation
     *
     * @remarks
     * Overloaded `$t`. About details, see the {@link $t} remarks.
     *
     * @param key - A target locale message key
     * @param named - A values of named interpolation
     * @param options - An options, see the {@link TranslateOptions}
     *
     * @returns translation message
     */
    $t<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys | number,
      named: NamedValue,
      options: TranslateOptions
    ): string
    /**
     * Resolve locale message translation
     *
     * @remarks
     * If this is used in a reactive context, it will re-evaluate once the locale changes.
     *
     * In {@link I18nMode | Composition API mode}, the `$rt` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer, and it work on **global scope**. About that details, see {@link Composer#rt | `Composer#rt` }.
     *
     * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `$tm`.
     *
     * @returns translated message
     */
    $rt(message: MessageFunction<VueMessageType> | VueMessageType): string
    /**
     * Resolve locale message translation for plurals
     *
     * @remarks
     * Overloaded `$rt`. About details, see the {@link $rt} remarks.
     *
     * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `$tm`.
     * @param plural - Which plural string to get. 1 returns the first one.
     * @param options - Additional {@link TranslateOptions | options} for translation
     *
     * @returns Translated message
     */
    $rt(
      message: MessageFunction<VueMessageType> | VueMessageType,
      plural: number,
      options?: TranslateOptions
    ): string
    /**
     * Resolve locale message translation for list interpolations
     *
     * @remarks
     * Overloaded `$rt`. About details, see the {@link $rt} remarks.
     *
     * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `$tm`.
     * @param list - A values of list interpolation.
     * @param options - Additional {@link TranslateOptions | options} for translation
     *
     * @returns Translated message
     */
    $rt(
      message: MessageFunction<VueMessageType> | VueMessageType,
      list: unknown[],
      options?: TranslateOptions
    ): string
    /**
     * Resolve locale message translation for named interpolations
     *
     * @remarks
     * Overloaded `$rt`. About details, see the {@link $rt} remarks.
     *
     * @param message - A target locale message to be resolved. You will need to specify the locale message returned by `$tm`.
     * @param named - A values of named interpolation.
     * @param options - Additional {@link TranslateOptions | options} for translation
     *
     * @returns Translated message
     */
    $rt(
      message: MessageFunction<VueMessageType> | VueMessageType,
      named: NamedValue,
      options?: TranslateOptions
    ): string
    /**
     * Translation message exist
     *
     * @remarks
     * About that details, see {@link VueI18n#te | `VueI18n#te` } or {@link Composer#te | `Composer#te`}.
     *
     * @param key - A target locale message key
     * @param locale - A locale, optional, override locale that global scope or local scope
     *
     * @returns If found locale message, `true`, else `false`, Note that `false` is returned even if the value present in the key is not translatable.
     */
    $te<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys,
      locale?: Locale
    ): boolean
    /**
     * Datetime formatting
     *
     * @remarks
     * If this is used in a reactive context, it will re-evaluate once the locale changes.
     *
     * In {@link I18nMode | Composition API mode}, the `$d` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer instance, and it work on **global scope**. About that details, see {@link Composer#d | `Composer#d` }.
     *
     * @param value - A value, timestamp number or `Date` instance
     *
     * @returns formatted value
     */
    $d(value: number | Date | string): string
    /**
     * Datetime formatting
     *
     * @remarks
     * Overloaded `$d`. About details, see the {@link $d} remarks.
     *
     * @param value - A value, timestamp number or `Date` instance
     * @param key - A key of datetime formats
     *
     * @returns formatted value
     */
    $d<
      Value extends number | Date | string = number,
      Key extends string = string,
      DefinedDateTimeFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedDateTimeFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      value: Value,
      key: Key | ResourceKeys
    ): string
    /**
     * Datetime formatting
     *
     * @remarks
     * Overloaded `$d`. About details, see the {@link $d} remarks.
     *
     * @param value - A value, timestamp number or `Date` instance
     * @param options - An {@link DateTimeOptions | options}
     *
     * @returns formatted value
     */
    $d<
      Value extends number | Date | string = number,
      Key extends string = string,
      DefinedDateTimeFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedDateTimeFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      value: Value,
      options: DateTimeOptions<Key | ResourceKeys>
    ): string
    /**
     * Datetime formatting
     *
     * @remarks
     * Overloaded `$d`. About details, see the {@link $d} remarks.
     *
     * @param value - A value, timestamp number or `Date` instance
     * @param key - A key of datetime formats
     * @param locale - A locale, optional, override locale that global scope or local scope
     *
     * @returns formatted value
     */
    $d<
      Value extends number | Date | string = number,
      Key extends string = string,
      DefinedDateTimeFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedDateTimeFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      value: Value,
      key: Key | ResourceKeys,
      locale: Locale
    ): string
    /**
     * Datetime formatting
     *
     * @remarks
     * Overloaded `$d`. About details, see the {@link $d} remarks.
     *
     * @param value - A value, timestamp number or `Date` instance
     * @param options - An {@link DateTimeOptions | options}
     * @param locale - A locale, optional, override locale that global scope or local scope
     *
     * @returns formatted value
     */
    $d<
      Value extends number | Date = number,
      Key extends string = string,
      DefinedDateTimeFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedDateTimeFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedDateTimeFormat]: DefinedDateTimeFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never,
      OptionsType = DateTimeOptions<Key | ResourceKeys>
    >(
      value: Value,
      options: OptionsType,
      locale: Locale
    ): IsPart<OptionsType> extends true ? Intl.DateTimeFormatPart[] : string
    /**
     * Number formatting
     *
     * @remarks
     * If this is used in a reactive context, it will re-evaluate once the locale changes.
     *
     * In {@link I18nMode | Composition API mode}, the `$n` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer instance,  and it work on **global scope**. About that details, see {@link Composer#n | `Composer.n` }.
     *
     * @param value - A number value
     *
     * @returns formatted value
     */
    $n(value: number): string
    /**
     * Number formatting
     *
     * @remarks
     * Overloaded `$n`. About details, see the {@link $n} remarks.
     *
     * @param value - A number value
     * @param key - A key of number formats
     *
     * @returns formatted value
     */
    $n<
      Key extends string = string,
      DefinedNumberFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedNumberFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      value: number,
      key: Key | ResourceKeys
    ): string
    /**
     * Number formatting
     *
     * @remarks
     * Overloaded `$n`. About details, see the {@link $n} remarks.
     *
     * @param value - A number value
     * @param options - An options, see the {@link NumberOptions}
     *
     * @returns formatted value
     */
    $n<
      Key extends string = string,
      DefinedNumberFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedNumberFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never,
      OptionsType = NumberOptions<Key | ResourceKeys>
    >(
      value: number,
      options: OptionsType
    ): IsPart<OptionsType> extends true ? Intl.NumberFormatPart[] : string
    /**
     * Number formatting
     *
     * @remarks
     * Overloaded `$n`. About details, see the {@link $n} remarks.
     *
     * @param value - A number value
     * @param key - A key of number formats
     * @param locale - A locale, optional, override locale that global scope or local scope
     *
     * @returns formatted value
     */
    $n<
      Key extends string = string,
      DefinedNumberFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedNumberFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      value: number,
      key: Key | ResourceKeys,
      locale: Locale
    ): string
    /**
     * Number formatting
     *
     * @remarks
     * Overloaded `$n`. About details, see the {@link $n} remarks.
     *
     * @param value - A number value
     * @param options - An options, see the {@link NumberOptions}
     * @param locale - A locale, optional, override locale that global scope or local scope
     *
     * @returns formatted value
     */
    $n<
      Key extends string = string,
      OptionsType = NumberOptions<Key | ResourceKeys>,
      DefinedNumberFormat extends
        RemovedIndexResources<DefineDateTimeFormat> = RemovedIndexResources<DefineDateTimeFormat>,
      Keys = IsEmptyObject<DefinedNumberFormat> extends false
        ? PickupFormatPathKeys<{
            [K in keyof DefinedNumberFormat]: DefinedNumberFormat[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      value: number,
      options: OptionsType,
      locale: Locale
    ): IsPart<OptionsType> extends true ? Intl.NumberFormatPart[] : string

    /**
     * Locale messages getter
     *
     * @remarks
     * In {@link I18nMode | Composition API mode}, the `$tm` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer instance, and it work on **global scope**. About that details, see {@link Composer#tm | `Composer.tm` }.
     * Based on the current `locale`, locale messages will be returned from Composer instance messages.
     * If you change the `locale`, the locale messages returned will also correspond to the locale.
     * If there are no locale messages for the given `key` in the composer instance messages, they will be returned with fallbacking.
     *
     * @param key - A target locale message key
     *
     * @returns locale messages
     */
    $tm<
      Key extends string,
      DefinedLocaleMessage extends
        RemovedIndexResources<DefineLocaleMessage> = RemovedIndexResources<DefineLocaleMessage>,
      Keys = IsEmptyObject<DefinedLocaleMessage> extends false
        ? JsonPaths<{
            [K in keyof DefinedLocaleMessage]: DefinedLocaleMessage[K]
          }>
        : never,
      ResourceKeys extends Keys = IsNever<Keys> extends false ? Keys : never
    >(
      key: Key | ResourceKeys
    ): LocaleMessageValue<VueMessageType> | {}
  }
}

declare module 'vue' {
  export interface GlobalComponents {
    ['i18n-t']: typeof Translation
    ['i18n-d']: typeof DatetimeFormat
    ['i18n-n']: typeof NumberFormat
    ['I18nT']: typeof Translation
    ['I18nD']: typeof DatetimeFormat
    ['I18nN']: typeof NumberFormat
  }
}
