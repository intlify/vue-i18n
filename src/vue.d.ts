import { Path } from './path'
import { NamedValue } from './message/runtime'
import { Locale, LocaleMessageValue } from './core/context'
import { TranslateOptions, DateTimeOptions, NumberOptions } from './core/index'
import { CustomBlocks, VueMessageType } from './composer'
import {
  VueI18n,
  VueI18nOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from './legacy'
import { ExportedGlobalComposer } from './i18n'

declare module '@vue/runtime-core' {
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
  }

  /**
   * Component Custom Propertieis for Vue I18n
   *
   * @VueI18nInjection
   */
  export interface ComponentCustomProperties {
    /**
     * Exported Global Composer instance, or global VueI18n instance.
     *
     * @remarks
     * You can get the {@link ExportedGlobalComposer | exported composer instance} which are exported from global {@link Composer | composer instance} created with {@link createI18n}, or global {@link VueI18n | VueI18n instance}.
     * You can get the exported composer instance in {@link I18nMode | compostion mode}, or the Vuei18n instance in {@link I18nMode | legacy mode}, which is the instance you can refer to with this property.
     * The locales, locale messages, and other resources managed by the instance referenced by this property are valid as global scope.
     * If the `i18n` component option is not specified, it's the same as the VueI18n instance that can be referenced by the {@link I18n.global | global} property of the i18n instance.
     */
    $i18n: VueI18n | ExportedGlobalComposer
    /**
     * Translation function
     *
     * @remarks
     * In {@link I18nMode | compostion mode}, the `$t` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer, and it work on **global scope**. About that details, see {@link Composer.t | `Composer#t` }.
     *
     * In {@link I18nMode | legacy mode}, the input / output is the same as for VueI18n instance. About that details, see {@link VueI18n.t | `VueI18n#t`}.
     */
    $t(key: Path): TranslateResult
    $t(key: Path, locale: Locale): TranslateResult
    $t(key: Path, locale: Locale, list: unknown[]): TranslateResult
    $t(key: Path, locale: Locale, named: object): TranslateResult
    $t(key: Path, list: unknown[]): TranslateResult
    $t(key: Path, named: Record<string, unknown>): TranslateResult
    $t(key: Path): string
    $t(key: Path, plural: number): string
    $t(key: Path, plural: number, options: TranslateOptions): string
    $t(key: Path, defaultMsg: string): string
    $t(key: Path, defaultMsg: string, options: TranslateOptions): string
    $t(key: Path, list: unknown[]): string
    $t(key: Path, list: unknown[], plural: number): string
    $t(key: Path, list: unknown[], defaultMsg: string): string
    $t(key: Path, list: unknown[], options: TranslateOptions): string
    $t(key: Path, named: NamedValue): string
    $t(key: Path, named: NamedValue, plural: number): string
    $t(key: Path, named: NamedValue, defaultMsg: string): string
    $t(key: Path, named: NamedValue, options: TranslateOptions): string
    /**
     * Pluralization function
     *
     * @remarks
     * The input / output is the same as for VueI18n instance. About that details, see {@link VueI18n.tc | `VueI18n#tc` }.
     *
     * This property is supported for legacy mode only
     */
    $tc(key: Path): TranslateResult
    $tc(key: Path, locale: Locale): TranslateResult
    $tc(key: Path, list: unknown[]): TranslateResult
    $tc(key: Path, named: Record<string, unknown>): TranslateResult
    $tc(key: Path, choice: number): TranslateResult
    $tc(key: Path, choice: number, locale: Locale): TranslateResult
    $tc(key: Path, choice: number, list: unknown[]): TranslateResult
    $tc(
      key: Path,
      choice: number,
      named: Record<string, unknown>
    ): TranslateResult
    /**
     * Translation exist function
     *
     * @remarks
     * The input / output is the same as for VueI18n instance. About that details, see {@link VueI18n.te | `VueI18n.#te` }.
     *
     * This property is supported for legacy mode only
     */
    $te(key: Path, locale?: Locale): boolean
    /**
     * Datetime localization function
     *
     * @remarks
     * In {@link I18nMode | compostion mode}, the `$d` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer instance, and it work on **global scope**. About that details, see {@link Composer.d | `Composer#d` }.
     *
     * In {@link I18nMode | legacy mode}, the input / output is the same as for VueI18n instance. About that details, see {@link VueI18n.d | `VueI18n#d` }.
     */
    $d(value: number | Date): DateTimeFormatResult
    $d(value: number | Date, key: string): DateTimeFormatResult
    $d(value: number | Date, key: string, locale: Locale): DateTimeFormatResult
    $d(
      value: number | Date,
      args: { [key: string]: string }
    ): DateTimeFormatResult
    $d(value: number | Date): string
    $d(value: number | Date, key: string): string
    $d(value: number | Date, key: string, locale: Locale): string
    $d(value: number | Date, options: DateTimeOptions): string
    /**
     * Number localization function
     *
     * @remarks
     * In {@link I18nMode | compostion mode}, the `$n` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer instance,  and it work on **global scope**. About that details, see {@link Composer.n | `Composer.n` }.
     *
     * In {@link I18nMode | legacy mode}, the input / output is the same as for VueI18n instance. About that details, see {@link VueI18n.n | `VueI18n.n` }.
     */
    $n(value: number): NumberFormatResult
    $n(value: number, key: string): NumberFormatResult
    $n(value: number, key: string, locale: Locale): NumberFormatResult
    $n(value: number, args: { [key: string]: string }): NumberFormatResult
    $n(value: number): string
    $n(value: number, key: string): string
    $n(value: number, key: string, locale: Locale): string
    $n(value: number, options: NumberOptions): string
    /**
     * Translation locale messages function
     *
     * @remarks
     * In {@link I18nMode | compostion mode}, the `$tm` is injected by `app.config.globalProperties`.
     * the input / output is the same as for Composer instance, and it work on **global scope**. About that details, see {@link Composer.tm | `Composer.tm` }.
     *
     * In {@link I18nMode | legacy mode}, the input / output is the same as for VueI18n instance. About that details, see {@link VueI18n.tm | `VueI18n#tm` }.
     */
    $tm(key: Path): LocaleMessageValue<VueMessageType> | {}
  }
}
