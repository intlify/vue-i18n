import { assign, create, isNumber, isObject, isString } from '@intlify/shared'
import { defineComponent, h } from 'vue'
import { useI18n } from '../i18n'
import { TranslateVNodeSymbol } from '../symbols'
import { BaseFormatPropsValidators } from './base'
import { getFragmentableTag, getInterpolateArg } from './utils'

import type { TranslateOptions } from '@intlify/core-base'
import type {
  ComponentOptions,
  SetupContext,
  VNodeChild,
  VNodeProps
} from 'vue'
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

export const TranslationImpl: ComponentOptions<TranslationProps> =
  /*#__PURE__*/ defineComponent({
    name: 'i18n-t', // eslint-disable-line vue/component-definition-name-casing
    props: /*#__PURE__*/ assign(
      {},
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
      BaseFormatPropsValidators
    ),
    setup(props: TranslationProps, context: SetupContext) {
      const { slots, attrs } = context
      // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
      const i18n =
        props.i18n ||
        (useI18n({
          useScope: props.scope as 'global' | 'parent',
          __useComponent: true
        }) as unknown as Composer & ComposerInternal)

      return (): VNodeChild => {
        const keys = Object.keys(slots).filter(key => key[0] !== '_')
        const options = create() as TranslateOptions
        if (props.locale) {
          options.locale = props.locale
        }
        if (props.plural !== undefined) {
          options.plural = isString(props.plural) ? +props.plural : props.plural
        }
        const arg = getInterpolateArg(context, keys)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const children = (i18n as any)[TranslateVNodeSymbol](
          props.keypath,
          arg,
          options
        )
        const assignedAttrs = assign(create(), attrs)
        const tag =
          isString(props.tag) || isObject(props.tag)
            ? props.tag
            : getFragmentableTag()
        return h(tag, assignedAttrs, children)
      }
    }
  })

/**
 * export the public type for h/tsx inference
 * also to avoid inline import() in generated d.ts files
 */

/**
 * Translation Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [TranslationProps](component#translationprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Component Interpolation](../../guide/advanced/component)
 *
 * @example
 * ```html
 * <div id="app">
 *   <!-- ... -->
 *   <i18n keypath="term" tag="label" for="tos">
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
export const Translation = TranslationImpl as unknown as {
  new (): {
    $props: VNodeProps & TranslationProps
  }
}

export const I18nT: typeof Translation = Translation
