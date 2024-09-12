import type { NamedValue, JsonPaths } from '@intlify/core-base'
import type {
  TranslateOptions,
  IsNever,
  IsEmptyObject
} from '@intlify/core-base'
import type { CustomBlocks } from '../../vue-i18n-core/src/composer'
import type {
  DefineLocaleMessage,
  RemovedIndexResources
} from '../../vue-i18n-core/src/composer'
import type {
  VueI18n,
  VueI18nOptions,
  TranslateResult
} from '../../vue-i18n-core/src/legacy'
import type { ExportedGlobalComposer } from '../../vue-i18n-core/src/i18n'

// --- THE CONTENT BELOW THIS LINE WILL BE APPENDED TO DTS FILE IN DIST DIRECTORY --- //
declare module 'vue' {
  /**
   * Component Custom Options for Vue I18n
   *
   * @VueI18nInjection
   */
  export interface ComponentCustomOptions {
    /**
     * VueI18n options
     *
     * @remarks
     * See the {@link VueI18nOptions}
     */
    i18n?: VueI18nOptions
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
     * Exported Global Composer instance, or global VueI18n instance.
     *
     * @remarks
     * You can get the {@link ExportedGlobalComposer | exported composer instance} which are exported from global {@link Composer | composer instance} created with {@link createI18n}, or global {@link VueI18n | VueI18n instance}.
     * You can get the exported composer instance in {@link I18nMode | Composition API mode}, or the Vuei18n instance in {@link I18nMode | Legacy API mode}, which is the instance you can refer to with this property.
     * The locales, locale messages, and other resources managed by the instance referenced by this property are valid as global scope.
     * If the `i18n` component custom option is not specified, it's the same as the VueI18n instance that can be referenced by the i18n instance {@link I18n.global | global} property.
     */
    $i18n: VueI18n | ExportedGlobalComposer
    /**
     * Locale message translation
     *
     * @remarks
     * If this is used in a reactive context, it will re-evaluate once the locale changes.
     *
     * In {@link I18nMode | Legacy API mode}, the input / output is the same as for VueI18n instance. About that details, see {@link VueI18n#t | `VueI18n#t`}.
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
      key: Key | ResourceKeys
    ): TranslateResult
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
      key: Key | ResourceKeys,
      plural: number
    ): TranslateResult
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
      key: Key | ResourceKeys,
      plural: number,
      options: TranslateOptions
    ): TranslateResult
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
      key: Key | ResourceKeys,
      defaultMsg: string
    ): TranslateResult
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
      key: Key | ResourceKeys,
      defaultMsg: string,
      options: TranslateOptions
    ): TranslateResult
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
      key: Key | ResourceKeys,
      list: unknown[]
    ): TranslateResult
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
      key: Key | ResourceKeys,
      list: unknown[],
      plural: number
    ): TranslateResult
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
      key: Key | ResourceKeys,
      list: unknown[],
      defaultMsg: string
    ): TranslateResult
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
      key: Key | ResourceKeys,
      list: unknown[],
      options: TranslateOptions
    ): TranslateResult
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
      key: Key | ResourceKeys,
      named: NamedValue
    ): TranslateResult
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
      key: Key | ResourceKeys,
      named: NamedValue,
      plural: number
    ): TranslateResult
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
      key: Key | ResourceKeys,
      named: NamedValue,
      defaultMsg: string
    ): TranslateResult
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
      key: Key | ResourceKeys,
      named: NamedValue,
      options: TranslateOptions
    ): TranslateResult
  }
}
