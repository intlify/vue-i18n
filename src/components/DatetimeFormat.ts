import { RenderFunction, SetupContext } from 'vue'
import { useI18n } from '../i18n'
import { DateTimeOptions } from '../core'
import { Composer, ComposerInternal } from '../composer'
import { renderFormatter, FormattableProps } from './formatRenderer'
import { baseFormatProps } from './base'

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
      i18n.__datetimeParts(...args)
    )
  }
}
