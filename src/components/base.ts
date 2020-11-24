import { Locale } from '../core'
import { I18nScope } from '../i18n'

export type ComponetI18nScope = Exclude<I18nScope, 'local'>

/**
 * Base Format Props for Vue I18n Component
 *
 * @VueI18nComponent
 */
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
    type: String,
    validator: (val: ComponetI18nScope): boolean =>
      val === 'parent' || val === 'global',
    default: 'parent' as ComponetI18nScope
  }
}
