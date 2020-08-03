import { App } from 'vue'
import { I18nSymbol, I18n } from './i18n'
import { Translation, NumberFormat, DatetimeFormat } from './components'
import { vTDirective } from './directive'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { isPlainObject, warn, isBoolean } from './utils'

/**
 * I18n plugin options
 *
 * @remarks
 * An options specified when installing vue-i18n as Vue plugin with using `app.use`.
 */
export interface I18nPluginOptions {
  useI18nComponentName?: boolean
  globalInstall?: boolean
}

export function apply<Messages, DateTimeFormats, NumberFormats>(
  app: App,
  i18n: I18n<Messages, DateTimeFormats, NumberFormats>,
  ...options: unknown[]
): void {
  const pluginOptions = isPlainObject(options[0])
    ? (options[0] as I18nPluginOptions)
    : {}
  const useI18nComponentName = !!pluginOptions.useI18nComponentName
  const globalInstall = isBoolean(pluginOptions.globalInstall)
    ? pluginOptions.globalInstall
    : true

  if (__DEV__ && globalInstall && useI18nComponentName) {
    warn(
      getWarnMessage(I18nWarnCodes.COMPONENT_NAME_LEGACY_COMPATIBLE, {
        name: Translation.name
      })
    )
  }

  if (globalInstall) {
    // install components
    app.component(
      !useI18nComponentName ? Translation.name : 'i18n',
      Translation
    )
    app.component(NumberFormat.name, NumberFormat)
    app.component(DatetimeFormat.name, DatetimeFormat)
  }

  // install directive
  app.directive(
    't',
    vTDirective<Messages, DateTimeFormats, NumberFormats>(i18n)
  )

  // setup global provider
  app.provide(I18nSymbol, i18n)
}
