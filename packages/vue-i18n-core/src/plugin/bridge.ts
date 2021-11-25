import { Translation } from '../components/Translation'
import { NumberFormat } from '../components/NumberFormat'
import { DatetimeFormat } from '../components/DatetimeFormat'
import { isPlainObject, isBoolean } from '@intlify/shared'

import type { I18nPluginOptions } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apply(Vue: any, ...options: unknown[]): void {
  const pluginOptions = isPlainObject(options[0])
    ? (options[0] as I18nPluginOptions)
    : {}
  const globalInstall = isBoolean(pluginOptions.globalInstall)
    ? pluginOptions.globalInstall
    : true

  if (__BRIDGE__ && globalInstall) {
    // install components
    Vue.component(Translation.name, Translation)
    Vue.component(NumberFormat.name, NumberFormat)
    Vue.component(DatetimeFormat.name, DatetimeFormat)
  }
}
