import { Path } from './path'
import { Locale, LocaleMessageValue } from './core/context'
import { CustomBlocks, VueMessageType } from './composer'
import {
  VueI18n,
  VueI18nOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from './legacy'

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
     * VueI18n class compatible interface. See {@link VueI18n}
     *
     * @remarks
     * If you have specified an `i18n` option at component options,
     * you will be able to get a VueI18n instance at the component,
     * Otherwise, you will be able get root VueI18n instance.
     *
     * This property is supported for legacy API only
     */
    $i18n?: VueI18n
    /**
     * translation method
     *
     * @param key - required, type {@link Path}
     * @param locale - optional, type {@link Locale}
     * @param values - optional, type `Array` or `Object`
     * @returns translated string
     *
     * @remarks
     * Localize the locale message of `key`.
     * Localize in preferentially component locale messages than global locale messages.
     * If not specified component locale messages, localize with global locale messages.
     * If you specified `locale`, localize the locale messages of `locale`.
     * If you specified `key` of list / named formatting local messages, you must specify `values` too.
     *
     * This property is supported for legacy API only
     */
    $t?: (...args: unknown[]) => TranslateResult
    /**
     * pluralization method
     *
     * @param key - required, type {@link Path}
     * @param choice - optional, type `number`, default `1`
     * @param locale - optional, type {@link Locale}
     * @param values - optional, type `string` or `Array` or `Object`
     * @returns pluralized string
     *
     * @remarks
     * Localize the locale message of `key` with pluralization.
     * Localize in preferentially component locale messages than global locale messages.
     * If not specified component locale messages, localize with global locale messages.
     * If you specified `locale`, localize the locale messages of `locale`.
     * If you will specify string value to `values`, localize the locale messages of value.
     * If you will specify Array or Object value to `values`, you must specify with `values` of `$t`.
     *
     * This property is supported for legacy API only
     */
    $tc?: (...args: unknown[]) => TranslateResult
    /**
     * translation exist method
     *
     * @param key - required, type {@link Path}
     * @param locale - optional, type {@link Locale}
     * @returns key exsiting result
     *
     * @remarks
     * Check whether key exists.
     * In Vue instance, If not specified component locale messages,
     * check with global locale messages. If you specified `locale`, check the locale messages of `locale`
     *
     * This property is supported for legacy API only
     */
    $te?: (key: Path, locale?: Locale) => boolean
    /**
     * datetime method
     *
     * @param value - required, type `number` or `Date`
     * @param key - optional, type {@link Path} or `Object`
     * @param locale - optional, type {@link Locale}
     * @returns formatted datetime result
     *
     * @remarks
     * Localize the datetime of `value` with datetime format of `key`.
     * The datetime format of `key` need to register to `dateTimeFormats` option of {@link VueI18nOptions},
     * and depend on `locale` option of {@link VueI18nOptions}.
     * If you will specify locale argument, it will have priority over `locale` of {@link VueI18nOptions}.
     *
     * If the datetime format of `key` not exist in `dateTimeFormats` option,
     * fallback to depend on `fallbackLocale` of {@link VueI18nOptions}.
     *
     * This property is supported for legacy API only
     */
    $d?: (...args: unknown[]) => DateTimeFormatResult
    /**
     * number method
     *
     * @param value - required, type `number`
     * @param format - optional, type {@link Path} or `Object`
     * @param locale - optional, type {@link Locale}
     * @returns formatted number result
     *
     * @remarks
     * Localize the number of `value` with number format of `format`.
     * The number format of `format` need to register to `numberFormats` option of {@link VueI18nOptions},
     * and depend on `locale` option of {@link VueI18nOptions}.
     * If you will specify `locale` argument, it will have priority over `locale` option of {@link VueI18nOptions}
     *
     * If the number format of `format` not exist in `numberFormats` option,
     * fallback to depend on `fallbackLocale` option of {@link VueI18nOptions}
     *
     * This property is supported for legacy API only
     */
    $n?: (...args: unknown[]) => NumberFormatResult
    /**
     * translation messages method
     *
     * @param key - required, target keypath
     * @returns locale messages
     *
     * @remarks
     * Get the locale message of `key`.
     * Get in preferentially component locale messages than global locale messages.
     * If the target locale messages is not found locally, get it from the global, otherwise returns an empty object.
     *
     * This property is supported for legacy API only
     */
    $tm?: (key: Path) => LocaleMessageValue<VueMessageType> | {}
  }
}
