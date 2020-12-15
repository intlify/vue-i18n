import { useI18n } from '../i18n'
import { DatetimePartsSymbol } from '../composer'
import { renderFormatter } from './formatRenderer'
import { baseFormatProps } from './base'

import type { RenderFunction, SetupContext } from 'vue'
import type { DateTimeOptions } from '@intlify/core-base'
import type { Composer, ComposerInternal } from '../composer'
import type { FormattableProps } from './formatRenderer'

/**
 * DatetimeForamt Component Props
 *
 * @VueI18nComponent
 */
export type DatetimeFormatProps = FormattableProps<
  number | Date,
  Intl.DateTimeFormatOptions
>

const DATETIME_FORMAT_KEYS = [
  'dateStyle',
  'timeStyle',
  'fractionalSecondDigits',
  'calendar',
  'dayPeriod',
  'numberingSystem',
  'localeMatcher',
  'timeZone',
  'hour12',
  'hourCycle',
  'formatMatcher',
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName'
]

/**
 * Datetime Format Component
 *
 * @remarks
 * See the following items for property about details
 *
 * @VueI18nSee [FormattableProps](component#formattableprops)
 * @VueI18nSee [BaseFormatProps](component#baseformatprops)
 * @VueI18nSee [Custom Formatting](../essentials/datetime#custom-formatting)
 *
 * @VueI18nDanger
 * Not supported IE, due to no support `Intl.DateTimeForamt#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)
 *
 * If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)
 *
 * @VueI18nComponent
 */
export const DatetimeFormat = {
  /* eslint-disable */
  name: 'i18n-d',
  props: {
    ...baseFormatProps,
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  },
  /* eslint-enable */
  setup(props: DatetimeFormatProps, context: SetupContext): RenderFunction {
    const i18n = useI18n({ useScope: 'parent' }) as Composer & ComposerInternal

    return renderFormatter<
      FormattableProps<number | Date, Intl.DateTimeFormatOptions>,
      number | Date,
      Intl.DateTimeFormatOptions,
      DateTimeOptions,
      Intl.DateTimeFormatPart
    >(props, context, DATETIME_FORMAT_KEYS, (...args: unknown[]) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (i18n as any)[DatetimePartsSymbol](...args)
    )
  }
}
