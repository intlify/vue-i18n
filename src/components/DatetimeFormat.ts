import {
  getCurrentInstance,
  defineComponent,
  SetupContext,
  PropType
} from 'vue'
import { useI18n, getComposer } from '../i18n'
import { DateTimeOptions } from '../core'
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
    const instance = getCurrentInstance()
    // TODO: should be raise unexpected error, if `instance` is null
    const i18n =
      instance !== null
        ? instance.parent !== null
          ? getComposer(instance.parent)
          : useI18n()
        : useI18n()

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
