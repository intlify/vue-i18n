import { App, Component } from 'vue'
import { I18n } from './i18n'
import { Translation, NumberFormat, DatetimeFormat } from './components'
import { vTDirective } from './directive'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { isPlainObject, warn, isBoolean } from './utils'

/**
 * I18n plugin options
 *
 * @remarks
 * An options specified when installing vue-i18n as Vue plugin with using `app.use`.
 *
 * @VueI18nGeneral
 */
export interface I18nPluginOptions {
  useI18nComponentName?: boolean
  globalInstall?: boolean
}

export function apply<
  Messages,
  DateTimeFormats,
  NumberFormats,
  Legacy extends boolean
>(
  app: App,
  i18n: I18n<Messages, DateTimeFormats, NumberFormats, Legacy>,
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
      Translation as Component
    )
    app.component(NumberFormat.name, NumberFormat as Component)
    app.component(DatetimeFormat.name, DatetimeFormat as Component)
  }

  // install directive
  app.directive(
    't',
    vTDirective<Messages, DateTimeFormats, NumberFormats, Legacy>(i18n)
  )
}
