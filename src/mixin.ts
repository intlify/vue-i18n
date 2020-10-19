import { ComponentOptions, getCurrentInstance } from 'vue'
import { Path } from './path'
import { Locale, LocaleMessageValue } from './core/context'
import { Composer, ComposerInternalOptions, VueMessageType } from './composer'
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
import { addTimelineEvent } from './debugger/devtools'
import { DevToolsEmitter, DevToolsEmitterEvents } from './debugger/constants'
import { createEmitter } from './debugger/emitter'

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
      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && !__NODE_JS__) {
        this.$el.__INTLIFY__ = this.$i18n.__composer
        const emitter: DevToolsEmitter = (this.__emitter = createEmitter<
          DevToolsEmitterEvents
        >())
        const _vueI18n = (this.$i18n as unknown) as VueI18nInternal<
          Messages,
          DateTimeFormats,
          NumberFormats
        >
        _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter)
        emitter.on('*', addTimelineEvent)
      }
    },

    beforeUnmount(): void {
      const instance = getCurrentInstance()
      /* istanbul ignore if */
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
      }

      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && !__NODE_JS__) {
        if (this.__emitter) {
          this.__emitter.off('*', addTimelineEvent)
          delete this.__emitter
        }
        const _vueI18n = (this.$i18n as unknown) as VueI18nInternal<
          Messages,
          DateTimeFormats,
          NumberFormats
        >
        _vueI18n.__disableEmitter && _vueI18n.__disableEmitter()
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
