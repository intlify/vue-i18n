import { h } from 'vue'
import { isNumber, isString, isObject } from '@intlify/shared'
import { TransrateVNodeSymbol } from '../symbols'
import { useI18n } from '../i18n'
import { baseFormatProps } from './base'
import { assign } from '@intlify/shared'
import { getInterpolateArg, getFragmentableTag } from './utils'

import type { VNodeChild } from 'vue'
import type { TranslateOptions } from '@intlify/core-base'
import type { Composer, ComposerInternal } from '../composer'
import type { BaseFormatProps } from './base'

/**
 * Translation Component Props
 *
 * @VueI18nComponent
 */
export interface TranslationProps extends BaseFormatProps {
  /**
   * @remarks
   * The locale message key can be specified prop
   */
  keypath: string
  /**
   * @remarks
   * The Plural Choosing the message number prop
   */
  plural?: number | string
}

/**
 * Translation Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [TranslationProps](component#translationprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Component Interpolation](../guide/advanced/component)
 *
 * @example
 * ```html
 * <div id="app">
 *   <!-- ... -->
 *   <i18n path="term" tag="label" for="tos">
 *     <a :href="url" target="_blank">{{ $t('tos') }}</a>
 *   </i18n>
 *   <!-- ... -->
 * </div>
 * ```
 * ```js
 * import { createApp } from 'vue'
 * import { createI18n } from 'vue-i18n'
 *
 * const messages = {
 *   en: {
 *     tos: 'Term of Service',
 *     term: 'I accept xxx {0}.'
 *   },
 *   ja: {
 *     tos: '利用規約',
 *     term: '私は xxx の{0}に同意します。'
 *   }
 * }
 *
 * const i18n = createI18n({
 *   locale: 'en',
 *   messages
 * })
 *
 * const app = createApp({
 *   data: {
 *     url: '/term'
 *   }
 * }).use(i18n).mount('#app')
 * ```
 *
 * @VueI18nComponent
 */
export const Translation = /* #__PURE__*/ /* defineComponent */ {
  /* eslint-disable */
  name: 'i18n-t',
  props: assign(
    {
      keypath: {
        type: String,
        required: true
      },
      plural: {
        type: [Number, String],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        validator: (val: any): boolean => isNumber(val) || !isNaN(val)
      }
    },
    baseFormatProps
  ),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props: any, context: any): any {
    const { slots, attrs } = context
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    const i18n =
      props.i18n ||
      (useI18n({
        useScope: props.scope as 'global' | 'parent',
        __useComponent: true
      }) as Composer & ComposerInternal)
    const keys = Object.keys(slots).filter(key => key !== '_')

    return (): VNodeChild => {
      const options = {} as TranslateOptions
      if (props.locale) {
        options.locale = props.locale
      }
      if (props.plural !== undefined) {
        options.plural = isString(props.plural) ? +props.plural : props.plural
      }
      const arg = getInterpolateArg(context, keys)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children = (i18n as any)[TransrateVNodeSymbol](
        props.keypath,
        arg,
        options
      )
      const assignedAttrs = assign({}, attrs)
      const tag =
        isString(props.tag) || isObject(props.tag)
          ? props.tag
          : getFragmentableTag('span')
      return h(tag, assignedAttrs, children)
    }
  }
}
