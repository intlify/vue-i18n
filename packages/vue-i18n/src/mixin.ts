import { getCurrentInstance } from 'vue'
import { getLocaleMessages, SetPluralRulesSymbol } from './composer'
import { createVueI18n } from './legacy'
import { createI18nError, I18nErrorCodes } from './errors'
import { addTimelineEvent } from './devtools'
import { createEmitter } from '@intlify/core-base'

import type { ComponentOptions } from 'vue'
import type { Path } from '@intlify/core-base'
import type {
  Locale,
  LocaleMessageValue,
  DevToolsEmitter,
  DevToolsEmitterEvents
} from '@intlify/core'
import type {
  Composer,
  ComposerInternalOptions,
  VueMessageType
} from './composer'
import type {
  VueI18n,
  VueI18nInternal,
  VueI18nOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from './legacy'
import type { I18nInternal } from './i18n'

// supports compatibility for legacy vue-i18n APIs
export function defineMixin<Messages, DateTimeFormats, NumberFormats>(
  vuei18n: VueI18n<Messages, DateTimeFormats, NumberFormats>,
  composer: Composer<Messages, DateTimeFormats, NumberFormats>,
  i18n: I18nInternal
): ComponentOptions {
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
        if (this === this.$root) {
          this.$i18n = mergeToRoot(vuei18n, optionsI18n)
        } else {
          this.$i18n = createVueI18n(optionsI18n)
        }
      } else if (options.__i18n) {
        if (this === this.$root) {
          this.$i18n = mergeToRoot(vuei18n, options)
        } else {
          this.$i18n = createVueI18n({
            __i18n: (options as ComposerInternalOptions<Messages>).__i18n,
            __root: composer
          } as VueI18nOptions)
        }
      } else {
        // set global
        this.$i18n = vuei18n
      }

      ;((vuei18n as unknown) as VueI18nInternal<
        Messages,
        DateTimeFormats,
        NumberFormats
      >).__onComponentInstanceCreated(this.$i18n)
      i18n.__setInstance<
        Messages,
        DateTimeFormats,
        NumberFormats,
        VueI18n<Messages, DateTimeFormats, NumberFormats>
      >(
        instance,
        this.$i18n as VueI18n<Messages, DateTimeFormats, NumberFormats>
      )

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
      /* istanbul ignore if */
      if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && !__NODE_JS__) {
        this.$el.__INTLIFY__ = this.$i18n.__composer
        const emitter: DevToolsEmitter = (this.__emitter = createEmitter<DevToolsEmitterEvents>())
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

      /* istanbul ignore if */
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

function mergeToRoot<Messages, DateTimeFormats, NumberFormats>(
  root: VueI18n<Messages, DateTimeFormats, NumberFormats>,
  options: VueI18nOptions &
    ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats>
): VueI18n<Messages, DateTimeFormats, NumberFormats> {
  root.locale = options.locale || root.locale
  root.fallbackLocale = options.fallbackLocale || root.fallbackLocale
  root.missing = options.missing || root.missing
  root.silentTranslationWarn =
    options.silentTranslationWarn || root.silentFallbackWarn
  root.silentFallbackWarn =
    options.silentFallbackWarn || root.silentFallbackWarn
  root.formatFallbackMessages =
    options.formatFallbackMessages || root.formatFallbackMessages
  root.postTranslation = options.postTranslation || root.postTranslation
  root.warnHtmlInMessage = options.warnHtmlInMessage || root.warnHtmlInMessage
  root.escapeParameterHtml =
    options.escapeParameterHtml || root.escapeParameterHtml
  root.sync = options.sync || root.sync
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(root as any).__composer[SetPluralRulesSymbol](
    options.pluralizationRules || root.pluralizationRules
  )
  const messages = getLocaleMessages<VueMessageType>(root.locale, {
    messages: options.messages,
    __i18n: options.__i18n
  })
  Object.keys(messages).forEach(locale =>
    root.mergeLocaleMessage(locale, messages[locale])
  )
  if (options.datetimeFormats) {
    Object.keys(options.datetimeFormats).forEach(locale =>
      root.mergeDateTimeFormat(locale, options.datetimeFormats![locale])
    )
  }
  if (options.numberFormats) {
    Object.keys(options.numberFormats).forEach(locale =>
      root.mergeNumberFormat(locale, options.numberFormats![locale])
    )
  }
  return root
}
