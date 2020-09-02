import { ComponentOptions, getCurrentInstance } from 'vue'
import { Path } from './path'
import { Locale, LocaleMessageValue } from './core/context'
import {
  Composer,
  ComposerInternalOptions,
  CustomBlocks,
  VueMessageType
} from './composer'
import {
  VueI18n,
  VueI18nInternal,
  createVueI18n,
  VueI18nOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from './legacy'
import { I18nInternal } from './i18n'
import { createI18nError, I18nErrorCodes } from './errors'

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
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
  interface ComponentCustomProperties {
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

// supports compatibility for legacy vue-i18n APIs
export function defineMixin<Messages, DateTimeFormats, NumberFormats>(
  vuei18n: VueI18n<Messages, DateTimeFormats, NumberFormats>,
  composer: Composer<Messages, DateTimeFormats, NumberFormats>,
  i18n: I18nInternal
): ComponentOptions {
  const legacy = (vuei18n as unknown) as VueI18nInternal<
    Messages,
    DateTimeFormats,
    NumberFormats
  >
  return {
    beforeCreate(): void {
      const instance = getCurrentInstance()
      /* istanbul ignore if */
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
      }

      const options = this.$options
      if (options.i18n) {
        const optionsI18n = options.i18n as VueI18nOptions &
          ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats>
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n
        }
        optionsI18n.__root = composer
        this.$i18n = createVueI18n(optionsI18n)
        legacy.__onComponentInstanceCreated(this.$i18n)

        i18n.__setInstance<
          Messages,
          DateTimeFormats,
          NumberFormats,
          VueI18n<Messages, DateTimeFormats, NumberFormats>
        >(
          instance,
          this.$i18n as VueI18n<Messages, DateTimeFormats, NumberFormats>
        )
      } else if (options.__i18n) {
        this.$i18n = createVueI18n({
          __i18n: (options as ComposerInternalOptions<Messages>).__i18n,
          __root: composer
        } as VueI18nOptions)
        legacy.__onComponentInstanceCreated(this.$i18n)

        i18n.__setInstance<
          Messages,
          DateTimeFormats,
          NumberFormats,
          VueI18n<Messages, DateTimeFormats, NumberFormats>
        >(
          instance,
          this.$i18n as VueI18n<Messages, DateTimeFormats, NumberFormats>
        )
      } else {
        // set global
        this.$i18n = legacy
      }

      // defines vue-i18n legacy APIs
      this.$t = (...args: unknown[]): TranslateResult => this.$i18n.t(...args)
      this.$tc = (...args: unknown[]): TranslateResult => this.$i18n.tc(...args)
      this.$te = (key: Path, locale?: Locale): boolean =>
        this.$i18n.te(key, locale)
      this.$d = (...args: unknown[]): DateTimeFormatResult =>
        this.$i18n.d(...args)
      this.$n = (...args: unknown[]): NumberFormatResult =>
        this.$i18n.n(...args)
      this.$tm = (key: Path): LocaleMessageValue<VueMessageType> | {} =>
        this.$i18n.tm(key)
    },

    mounted(): void {
      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        this.$el.__INTLIFY__ = this.$i18n.__composer
      }
    },

    beforeDestroy(): void {
      const instance = getCurrentInstance()
      /* istanbul ignore if */
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
      }

      if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
        delete this.$el.__INTLIFY__
      }

      delete this.$t
      delete this.$tc
      delete this.$te
      delete this.$d
      delete this.$n
      delete this.$tm

      i18n.__deleteInstance(instance)
      delete this.$i18n
    }
  }
}
