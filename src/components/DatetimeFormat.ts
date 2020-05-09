import { defineComponent, SetupContext, PropType } from 'vue'
import { useI18n } from '../i18n'
import { DateTimeOptions } from '../core'
import { Composer, ComposerInternal } from '../composer'
import { renderFormatter, FormattableProps } from './formatRenderer'

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

export const DatetimeFormat = defineComponent({
  /* eslint-disable */
  name: 'i18n-d',
  props: {
    tag: {
      type: String
    },
    value: {
      type: [Number, Date] as PropType<number | Date>,
      required: true
    },
    format: {
      type: [String, Object]
    },
    locale: {
      type: String
    }
  },
  /* eslint-enable */
  setup(props, context: SetupContext) {
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
})
