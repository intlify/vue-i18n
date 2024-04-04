import { defineComponent } from 'vue'
import { assign } from '@intlify/shared'
import { DATETIME_FORMAT_OPTIONS_KEYS } from '@intlify/core-base'
import { useI18n } from '../i18n'
import { DatetimePartsSymbol } from '../symbols'
import { renderFormatter } from './formatRenderer'
import { baseFormatProps } from './base'

/* eslint-enable @typescript-eslint/no-unused-vars */
import type { VNodeProps } from 'vue'
import type { DateTimeOptions } from '@intlify/core-base'
import type { Composer, ComposerInternal } from '../composer'
import type { FormattableProps } from './formatRenderer'
import type { BaseFormatProps } from './base'

/**
 * DatetimeFormat Component Props
 *
 * @VueI18nComponent
 */
export type DatetimeFormatProps = FormattableProps<
  number | Date,
  Intl.DateTimeFormatOptions
>

export const DatetimeFormatImpl = /* #__PURE__*/ defineComponent({
  /* eslint-disable */
  name: 'i18n-d',
  props: assign(
    {
      value: {
        type: [Number, Date],
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
      FormattableProps<number | Date, Intl.DateTimeFormatOptions>,
      number | Date,
      Intl.DateTimeFormatOptions,
      DateTimeOptions,
      Intl.DateTimeFormatPart
    >(
      props as DatetimeFormatProps,
      context,
      DATETIME_FORMAT_OPTIONS_KEYS,
      (...args: unknown[]) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (i18n as any)[DatetimePartsSymbol](...args)
    )
  }
})

/**
 * Datetime Format Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [FormattableProps](component#formattableprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Custom Formatting](../guide/essentials/datetime#custom-formatting)
 *
 * @VueI18nDanger
 * Not supported IE, due to no support `Intl.DateTimeFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)
 *
 * If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)
 *
 * @VueI18nComponent
 */
export const DatetimeFormat = DatetimeFormatImpl as unknown as {
  new (): {
    $props: VNodeProps & DatetimeFormatProps & BaseFormatProps
  }
}

export const I18nD = DatetimeFormat
