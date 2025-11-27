import type {
  IsEmptyObject,
  IsNever,
  JsonPaths,
  NamedValue,
  TranslateOptions
} from '@intlify/core-base'
import type {
  CustomBlocks,
  DefineLocaleMessage,
  ExportedGlobalComposer,
  RemovedIndexResources
} from '@intlify/vue-i18n-core/petite'

// --- THE CONTENT BELOW THIS LINE WILL BE APPENDED TO DTS FILE IN DIST DIRECTORY --- //

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
  }
}
