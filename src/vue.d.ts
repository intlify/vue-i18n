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
import { ExportedComposer } from './i18n'

declare module '@vue/runtime-core' {
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

  export interface ComponentCustomProperties {
    /**
     * Global composer instance, or a instance that are compatible with vue-i18n@v8.x VueI18n interface
     *
     * @remarks
     * You can get the {@link I18n.global | global composer} created during the execution of {@link createI18n}.
     * This instance is global property injected into for each components by `app.config.globalProperties`.
     *
     * If you have specified `legacy: true` in options at `createI18n`, that is in legacy mode, {@link VueI18n} instance is set to for each the components.
     * Otherwise, you will be able get root VueI18n instance.
     */
    $i18n: VueI18n | ExportedComposer
    /**
     * translation method
     *
     * @remarks
     * In composable mode, In the case of composable mode, the method (property) is injected by `app.config.globalProperties`.
     * the input / output is the same as for `Composer`, and it's **global**. About that details, see {@link Composer.t | `Composer#t` }.
     *
     * In legacy mode, the input / output is the same as for `VueI18n` of vue-i18n@v8.x. About that details, see {@link VueI18n.t | `VueI18n#t`}.
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
     * pluralization method
     *
     * @remarks
     * The input / output is the same as for `VueI18n` of vue-i18n@v8.x. About that details, see {@link VueI18n.tc | `VueI18n#tc` }.
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
     * translation exist method
     *
     * @remarks
     * The input / output is the same as for `VueI18n` of vue-i18n@v8.x. About that details, see {@link VueI18n.te | `VueI18n.#te` }.
     *
     * This property is supported for legacy mode only
     */
    $te(key: Path, locale?: Locale): boolean
    /**
     * datetime method
     *
     * @remarks
     * In composable mode, In the case of composable mode, the method (property) is injected by `app.config.globalProperties`.
     * the input / output is the same as for `Composer`, and it's **global**. About that details, see {@link Composer.d | `Composer#d` }.
     *
     * In legacy mode, the input / output is the same as for `VueI18n` of vue-i18n@v8.x. About that details, see {@link VueI18n.d | `VueI18n#d` }.
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
     * number method
     *
     * @remarks
     * In composable mode, In the case of composable mode, the method (property) is injected by `app.config.globalProperties`.
     * the input / output is the same as for `Composer`,  and it's **global**. About that details, see {@link Composer.n | `Composer.n` }.
     *
     * In legacy mode, the input / output is the same as for `VueI18n` of vue-i18n@v8.x. About that details, see {@link VueI18n.n | `VueI18n.n` }.
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
     * translation messages method
     *
     * @remarks
     * In composable mode, In the case of composable mode, the method (property) is injected by `app.config.globalProperties`.
     * the input / output is the same as for `Composer`, and it's **global**. About that details, see {@link Composer.tm | `Composer.tm` }.
     *
     * In legacy mode, the input / output is the same as for `VueI18n` of vue-i18n@v8.x. About that details, see {@link VueI18n.tm | `VueI18n#tm` }.
     */
    $tm(key: Path): LocaleMessageValue<VueMessageType> | {}
  }
}
