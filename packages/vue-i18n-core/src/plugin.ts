import { Translation } from './components/Translation'
import { NumberFormat } from './components/NumberFormat'
import { DatetimeFormat } from './components/DatetimeFormat'
import { vTDirective } from './directive'
import { isPlainObject, isBoolean } from '@intlify/shared'

import type { App } from 'vue'
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

export function apply(app: App, i18n: I18n, ...options: unknown[]): void {
  const pluginOptions = isPlainObject(options[0])
    ? (options[0] as I18nPluginOptions)
    : {}
  const globalInstall = isBoolean(pluginOptions.globalInstall)
    ? pluginOptions.globalInstall
    : true

  if (!__LITE__ && globalInstall) {
    // install components
    app.component(Translation.name, Translation)
    app.component(NumberFormat.name, NumberFormat)
    app.component(DatetimeFormat.name, DatetimeFormat)
  }

  // install directive
  if (!__LITE__) {
    app.directive('t', vTDirective(i18n))
  }
}
