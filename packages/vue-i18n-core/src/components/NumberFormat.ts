import { defineComponent } from 'vue'
import { assign } from '@intlify/shared'
import { NUMBER_FORMAT_OPTIONS_KEYS } from '@intlify/core-base'
import { useI18n } from '../i18n'
import { NumberPartsSymbol } from '../symbols'
import { renderFormatter } from './formatRenderer'
import { baseFormatProps } from './base'

import type { VNodeProps } from 'vue'
import type { NumberOptions } from '@intlify/core-base'
import type { Composer, ComposerInternal } from '../composer'
import type { FormattableProps } from './formatRenderer'
import type { BaseFormatProps } from './base'

/**
 * NumberFormat Component Props
 *
 * @VueI18nComponent
 */
export type NumberFormatProps = FormattableProps<
  number,
  Intl.NumberFormatOptions
>

export const NumberFormatImpl = /*#__PURE__*/ defineComponent({
  /* eslint-disable */
  name: 'i18n-n',
  props: assign(
    {
      value: {
        type: Number,
        required: true
      },
      format: {
        type: [String, Object]
      }
    },
    baseFormatProps
  ),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props: any, context: any): any {
    const i18n =
      props.i18n ||
      (useI18n({
        useScope: props.scope as 'global' | 'parent',
        __useComponent: true
      }) as unknown as Composer & ComposerInternal)

    return renderFormatter<
      FormattableProps<number, Intl.NumberFormatOptions>,
      number,
      Intl.NumberFormatOptions,
      NumberOptions,
      Intl.NumberFormatPart
    >(
      props as NumberFormatProps,
      context,
      NUMBER_FORMAT_OPTIONS_KEYS,
      (...args: unknown[]) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i18n as any)[NumberPartsSymbol](...args)
    )
  }
})

/**
 * export the public type for h/tsx inference
 * also to avoid inline import() in generated d.ts files
 */

/**
 * Number Format Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [FormattableProps](component#formattableprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Custom Formatting](../guide/essentials/number#custom-formatting)
 *
 * @VueI18nDanger
 * Not supported IE, due to no support `Intl.NumberFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)
 *
 * If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-numberformat)
 *
 * @VueI18nComponent
 */
export const NumberFormat = NumberFormatImpl as unknown as {
  new (): {
    $props: VNodeProps & NumberFormatProps & BaseFormatProps
  }
}

export const I18nN = NumberFormat
