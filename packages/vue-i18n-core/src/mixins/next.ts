import { getCurrentInstance } from 'vue'
import { createVueI18n } from '../legacy'
import { createI18nError, I18nErrorCodes } from '../errors'
import { SetPluralRulesSymbol } from '../symbols'
import { addTimelineEvent } from '../devtools'
import { getLocaleMessages, adjustI18nResources } from '../utils'
import { createEmitter } from '@intlify/shared'

import type { ComponentOptions } from 'vue'
import type { Path } from '@intlify/core-base'
import type { Locale, LocaleMessageValue } from '@intlify/core'
import type {
  VueDevToolsEmitter,
  VueDevToolsEmitterEvents
} from '@intlify/vue-devtools'
import type {
  Composer,
  ComposerInternalOptions,
  ComposerOptions,
  VueMessageType
} from '../composer'
import type {
  VueI18n,
  VueI18nInternal,
  VueI18nOptions,
  VueI18nInternalOptions,
  TranslateResult,
  DateTimeFormatResult,
  NumberFormatResult
} from '../legacy'
import type { I18nInternal } from '../i18n'

/**
 * Supports compatibility for legacy vue-i18n APIs
 * This mixin is used when we use vue-i18n@v9.x or later
 */
export function defineMixin(
  vuei18n: VueI18n,
  composer: Composer,
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
          VueI18nInternalOptions &
          ComposerInternalOptions

        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n
        }
        optionsI18n.__root = composer
        if (this === this.$root) {
          // merge option and gttach global
          this.$i18n = mergeToGlobal(vuei18n, optionsI18n)
        } else {
          optionsI18n.__injectWithOption = true
          optionsI18n.__extender = i18n.__vueI18nExtend
          // atttach local VueI18n instance
          this.$i18n = createVueI18n(optionsI18n)
          // extend VueI18n instance
          const _vueI18n = this.$i18n as unknown as VueI18nInternal
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n)
          }
        }
      } else if (options.__i18n) {
        if (this === this.$root) {
          // merge option and gttach global
          this.$i18n = mergeToGlobal(vuei18n, options)
        } else {
          // atttach local VueI18n instance
          this.$i18n = createVueI18n({
            __i18n: (options as ComposerInternalOptions).__i18n,
            __injectWithOption: true,
            __extender: i18n.__vueI18nExtend,
            __root: composer
          } as VueI18nOptions & VueI18nInternalOptions)
          // extend VueI18n instance
          const _vueI18n = this.$i18n as unknown as VueI18nInternal
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n)
          }
        }
      } else {
        // attach global VueI18n instance
        this.$i18n = vuei18n
      }

      if (options.__i18nGlobal) {
        adjustI18nResources(composer, options as ComposerOptions, options)
      }

      // TODO: remove `__onComponentInstanceCreated`, because nuxt i18n v8 does not require it.
      ;(vuei18n as unknown as VueI18nInternal).__onComponentInstanceCreated(
        this.$i18n
      )

      // defines vue-i18n legacy APIs
      this.$t = (...args: unknown[]): TranslateResult => this.$i18n.t(...args)
      this.$rt = (...args: unknown[]): TranslateResult => this.$i18n.rt(...args)
      this.$tc = (...args: unknown[]): TranslateResult => this.$i18n.tc(...args)
      this.$te = (key: Path, locale?: Locale): boolean =>
        this.$i18n.te(key, locale)
      this.$d = (...args: unknown[]): DateTimeFormatResult =>
        this.$i18n.d(...args)
      this.$n = (...args: unknown[]): NumberFormatResult =>
        this.$i18n.n(...args)
      this.$tm = (key: Path): LocaleMessageValue<VueMessageType> | {} =>
        this.$i18n.tm(key)

      i18n.__setInstance(instance, this.$i18n as VueI18n)
    },

    mounted(): void {
      /* istanbul ignore if */
      if (
        (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
        !__NODE_JS__ &&
        this.$el &&
        this.$i18n
      ) {
        const _vueI18n = this.$i18n as unknown as VueI18nInternal
        this.$el.__VUE_I18N__ = _vueI18n.__composer
        const emitter: VueDevToolsEmitter = (this.__v_emitter =
          createEmitter<VueDevToolsEmitterEvents>())
        _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter)
        emitter.on('*', addTimelineEvent)
      }
    },

    unmounted(): void {
      const instance = getCurrentInstance()
      /* istanbul ignore if */
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
      }

      const _vueI18n = this.$i18n as unknown as VueI18nInternal

      /* istanbul ignore if */
      if (
        (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
        !__NODE_JS__ &&
        this.$el &&
        this.$el.__VUE_I18N__
      ) {
        if (this.__v_emitter) {
          this.__v_emitter.off('*', addTimelineEvent)
          delete this.__v_emitter
        }
        if (this.$i18n) {
          _vueI18n.__disableEmitter && _vueI18n.__disableEmitter()
          delete this.$el.__VUE_I18N__
        }
      }

      delete this.$t
      delete this.$rt
      delete this.$tc
      delete this.$te
      delete this.$d
      delete this.$n
      delete this.$tm

      if (_vueI18n.__disposer) {
        _vueI18n.__disposer()
        delete _vueI18n.__disposer
        delete _vueI18n.__extender
      }

      i18n.__deleteInstance(instance)
      delete this.$i18n
    }
  }
}

function mergeToGlobal(
  g: VueI18n,
  options: VueI18nOptions & ComposerInternalOptions
): VueI18n {
  g.locale = options.locale || g.locale
  g.fallbackLocale = options.fallbackLocale || g.fallbackLocale
  g.missing = options.missing || g.missing
  g.silentTranslationWarn =
    options.silentTranslationWarn || g.silentFallbackWarn
  g.silentFallbackWarn = options.silentFallbackWarn || g.silentFallbackWarn
  g.formatFallbackMessages =
    options.formatFallbackMessages || g.formatFallbackMessages
  g.postTranslation = options.postTranslation || g.postTranslation
  g.warnHtmlInMessage = options.warnHtmlInMessage || g.warnHtmlInMessage
  g.escapeParameterHtml = options.escapeParameterHtml || g.escapeParameterHtml
  g.sync = options.sync || g.sync
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(g as any).__composer[SetPluralRulesSymbol](
    options.pluralizationRules || g.pluralizationRules
  )
  const messages = getLocaleMessages(g.locale as Locale, {
    messages: options.messages,
    __i18n: options.__i18n
  })
  Object.keys(messages).forEach(locale =>
    g.mergeLocaleMessage(locale, messages[locale])
  )
  if (options.datetimeFormats) {
    Object.keys(options.datetimeFormats).forEach(locale =>
      g.mergeDateTimeFormat(locale, options.datetimeFormats![locale])
    )
  }
  if (options.numberFormats) {
    Object.keys(options.numberFormats).forEach(locale =>
      g.mergeNumberFormat(locale, options.numberFormats![locale])
    )
  }
  return g
}
