import { PropType } from 'vue'
import { Locale } from '../core'
import { I18nScope } from '../i18n'

export type ComponetI18nScope = Exclude<I18nScope, 'local'>

export interface BaseFormatProps {
  tag?: string | object
  locale?: Locale
  scope?: ComponetI18nScope
}

export const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String as PropType<ComponetI18nScope>,
    validator: (val: ComponetI18nScope): boolean =>
      val === 'parent' || val === 'global',
    default: 'parent' as ComponetI18nScope
  }
}
