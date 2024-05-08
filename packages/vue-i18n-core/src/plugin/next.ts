import { Translation } from '../components/Translation'
import { NumberFormat } from '../components/NumberFormat'
import { DatetimeFormat } from '../components/DatetimeFormat'
import { vTDirective } from '../directive'
import { isPlainObject, isBoolean } from '@intlify/shared'

import type { App } from 'vue'
import type { I18n } from '../i18n'
import type { I18nPluginOptions } from './types'

export function apply(app: App, i18n: I18n, ...options: unknown[]): void {
  const pluginOptions = isPlainObject(options[0])
    ? (options[0] as I18nPluginOptions)
    : {}
  const globalInstall = isBoolean(pluginOptions.globalInstall)
    ? pluginOptions.globalInstall
    : true

  if (!__LITE__ && globalInstall) {
    // install components
    ;[Translation.name, 'I18nT'].forEach(name =>
      app.component(name, Translation)
    )
    ;[NumberFormat.name, 'I18nN'].forEach(name =>
      app.component(name, NumberFormat)
    )
    ;[DatetimeFormat.name, 'I18nD'].forEach(name =>
      app.component(name, DatetimeFormat)
    )
  }

  // install directive
  if (!__LITE__) {
    app.directive('t', vTDirective(i18n))
  }
}
