import { isPlainObject, warn } from '@intlify/shared'
import { deepCopy } from '../utils'

import type { ComponentOptions } from 'vue'
import type { Locale } from '@intlify/core-base'
import type { I18n } from '../i18n'

/**
 * Port from vue-i18n@v8.x
 * This mixin is used when we use vue-i18n-bridge
 */
export function defineMixin(
  i18n: I18n,
  VueI18n: any // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
): ComponentOptions {
  return {
    beforeCreate(): void {
      const options: any = this.$options // eslint-disable-line @typescript-eslint/no-explicit-any
      if (options.__VUE18N__INSTANCE__) {
        return
      }
      options.i18n = options.i18n || (options.__i18nBridge ? {} : null)

      this._i18nBridgeRoot = i18n
      if (i18n.mode === 'composition') {
        this._i18n = i18n
        return
      }

      if (options.i18n) {
        if (options.i18n instanceof VueI18n) {
          // init locale messages via custom blocks
          if (options.__i18nBridge) {
            try {
              const localeMessages =
                options.i18n && options.i18n.messages
                  ? options.i18n.messages
                  : {}
              ;(options.__i18nBridge as string[]).forEach(resource =>
                deepCopy(JSON.parse(resource), localeMessages)
              )
              Object.keys(localeMessages).forEach((locale: Locale) => {
                options.i18n.mergeLocaleMessage(locale, localeMessages[locale])
              })
            } catch (e) {
              if (__DEV__) {
                console.error(
                  `Cannot parse locale messages via custom blocks.`,
                  e
                )
              }
            }
          }
          this._i18n = options.i18n
          this._i18nWatcher = this._i18n.watchI18nData()
        } else if (isPlainObject(options.i18n)) {
          const rootI18n =
            this.$root &&
            this.$root.$i18n &&
            this.$root.$i18n instanceof VueI18n
              ? this.$root.$i18n
              : null
          // component local i18n
          if (rootI18n) {
            options.i18n.root = this.$root
            options.i18n.formatter = rootI18n.formatter
            options.i18n.fallbackLocale = rootI18n.fallbackLocale
            options.i18n.formatFallbackMessages =
              rootI18n.formatFallbackMessages
            options.i18n.silentTranslationWarn = rootI18n.silentTranslationWarn
            options.i18n.silentFallbackWarn = rootI18n.silentFallbackWarn
            options.i18n.pluralizationRules = rootI18n.pluralizationRules
            options.i18n.preserveDirectiveContent =
              rootI18n.preserveDirectiveContent
          }

          // init locale messages via custom blocks
          if (options.__i18nBridge) {
            try {
              const localeMessages =
                options.i18n && options.i18n.messages
                  ? options.i18n.messages
                  : {}
              ;(options.__i18nBridge as string[]).forEach(resource =>
                deepCopy(JSON.parse(resource), localeMessages)
              )
              options.i18n.messages = localeMessages
            } catch (e) {
              if (__DEV__) {
                warn(`Cannot parse locale messages via custom blocks.`, e)
              }
            }
          }

          const { sharedMessages } = options.i18n
          if (sharedMessages && isPlainObject(sharedMessages)) {
            deepCopy(sharedMessages, options.i18n.messages)
          }

          this._i18n = new VueI18n(options.i18n)
          this._i18nWatcher = this._i18n.watchI18nData()

          if (options.i18n.sync === undefined || !!options.i18n.sync) {
            this._localeWatcher = this.$i18n.watchLocale()
          }

          if (rootI18n) {
            rootI18n.onComponentInstanceCreated(this._i18n)
          }
        } else {
          if (__DEV__) {
            warn(`Cannot be interpreted 'i18n' option.`)
          }
        }
      } else if (
        this.$root &&
        this.$root.$i18n &&
        this.$root.$i18n instanceof VueI18n
      ) {
        // root i18n
        this._i18n = this.$root.$i18n
      } else if (
        options.parent &&
        options.parent.$i18n &&
        options.parent.$i18n instanceof VueI18n
      ) {
        // parent i18n
        this._i18n = options.parent.$i18n
      }
    },

    beforeMount(): void {
      const options: any = this.$options // eslint-disable-line @typescript-eslint/no-explicit-any
      if (options.__VUE18N__INSTANCE__) {
        return
      }

      if (i18n.mode === 'composition') {
        return
      }

      options.i18n = options.i18n || (options.__i18nBridge ? {} : null)

      if (options.i18n) {
        if (options.i18n instanceof VueI18n) {
          // init locale messages via custom blocks
          this._i18n.subscribeDataChanging(this)
          this._subscribing = true
        } else if (isPlainObject(options.i18n)) {
          this._i18n.subscribeDataChanging(this)
          this._subscribing = true
        } else {
          if (__DEV__) {
            warn(`Cannot be interpreted 'i18n' option.`)
          }
        }
      } else if (
        this.$root &&
        this.$root.$i18n &&
        this.$root.$i18n instanceof VueI18n
      ) {
        this._i18n.subscribeDataChanging(this)
        this._subscribing = true
      } else if (
        options.parent &&
        options.parent.$i18n &&
        options.parent.$i18n instanceof VueI18n
      ) {
        this._i18n.subscribeDataChanging(this)
        this._subscribing = true
      }
    },

    beforeDestroy(): void {
      const options: any = this.$options // eslint-disable-line @typescript-eslint/no-explicit-any
      if (options.__VUE18N__INSTANCE__) {
        return
      }

      if (this._i18nBridgeRoot) {
        delete this._i18nBridgeRoot
        return
      }

      if (i18n.mode === 'composition') {
        delete this._i18n
        return
      }

      if (!this._i18n) {
        return
      }

      const self = this as any // eslint-disable-line @typescript-eslint/no-explicit-any
      this.$nextTick(() => {
        if (self._subscribing) {
          self._i18n.unsubscribeDataChanging(self)
          delete self._subscribing
        }

        if (self._i18nWatcher) {
          self._i18nWatcher()
          self._i18n.destroyVM()
          delete self._i18nWatcher
        }

        if (self._localeWatcher) {
          self._localeWatcher()
          delete self._localeWatcher
        }
      })
    }
  }
}
