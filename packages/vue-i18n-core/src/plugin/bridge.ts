import { Translation } from '../components/Translation'
import { DatetimeFormat } from '../components/DatetimeFormat'
import { I18nWarnCodes, getWarnMessage } from '../warnings'
import { isPlainObject, warn, isBoolean } from '@intlify/shared'

import type { I18n } from '../i18n'
import type { I18nPluginOptions } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apply(Vue: any, i18n: I18n, ...options: unknown[]): void {
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

  if (__BRIDGE__ && globalInstall) {
    // install components
    Vue.component(
      !useI18nComponentName ? Translation.name : 'i18n',
      Translation
    )
    // app.component(NumberFormat.name, NumberFormat)
    Vue.component(DatetimeFormat.name, DatetimeFormat)
  }
}
