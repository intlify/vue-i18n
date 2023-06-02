import { Translation } from '../components/Translation'
import { NumberFormat } from '../components/NumberFormat'
import { DatetimeFormat } from '../components/DatetimeFormat'
import { vTDirective } from '../directive'
import { I18nWarnCodes, getWarnMessage } from '../warnings'
import { isPlainObject, warn, isBoolean } from '@intlify/shared'

import type { App } from 'vue'
import type { I18n } from '../i18n'
import type { I18nPluginOptions } from './types'

export function apply(app: App, i18n: I18n, ...options: unknown[]): void {
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

  if (!(__LITE__ || __BRIDGE__) && globalInstall) {
    // install components
    ;[!useI18nComponentName ? Translation.name : 'i18n', 'I18nT'].forEach(
      name => app.component(name, Translation)
    )
    ;[NumberFormat.name, 'I18nN'].forEach(name =>
      app.component(name, NumberFormat)
    )
    ;[DatetimeFormat.name, 'I18nD'].forEach(name =>
      app.component(name, DatetimeFormat)
    )
  }

  // install directive
  if (!__LITE__ || !__BRIDGE__) {
    app.directive('t', vTDirective(i18n))
  }
}
