import { Translation, NumberFormat, DatetimeFormat } from './components'
import { vTDirective } from './directive'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { isPlainObject, warn, isBoolean } from '@intlify/shared'

import type { App, Component } from 'vue'
import type { I18n } from './i18n'

/**
 * Vue I18n plugin options
 *
 * @remarks
 * An options specified when installing Vue I18n as Vue plugin with using `app.use`.
 *
 * @VueI18nGeneral
 */
export interface I18nPluginOptions {
  /**
   * Whether to use the tag name `i18n` for Translation Component
   *
   * @remarks
   * This option is used for compatibility with Vue I18n v8.x.
   *
   * If you can't migrate right away, you can temporarily enable this option, and you can work Translation Component.
   *
   * @defaultValue `false`
   */
  useI18nComponentName?: boolean
  /**
   * Whether to globally install the components that is offered by Vue I18n
   *
   * @remarks
   * If this option is enabled, the components will be installed globally at `app.use` time.
   *
   * If you want to install manually in the `import` syntax, you can set it to `false` to install when needed.
   *
   * @defaultValue `true`
   */
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
