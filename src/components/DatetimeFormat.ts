import { h, defineComponent, SetupContext, VNodeArrayChildren } from 'vue'
import { useI18n } from '../i18n'
import { DateTimeOptions } from '../runtime'
import { isString, isPlainObject, isArray } from '../utils'

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
  name: 'i18n-d',
  props: {
    tag: {
      type: String
    },
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    },
    locale: {
      type: String
    }
  },
  setup(props, context: SetupContext) {
    const { slots, attrs } = context
    const i18n = useI18n()

    return () => {
      const options = { part: true } as DateTimeOptions
      let orverrides = {} as Intl.DateTimeFormatOptions

      if (props.locale) {
        options.locale = props.locale
      }

      if (isString(props.format)) {
        options.key = props.format
      } else if (isPlainObject(props.format)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (isString((props.format as any).key)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options.key = (props.format as any).key
        }
        // Filter out datetime format options only
        orverrides = Object.keys(props.format).reduce((options, prop) => {
          return DATETIME_FORMAT_KEYS.includes(prop)
            ? Object.assign({}, options, { [prop]: props.format[prop] })
            : options
        }, {})
      }

      const parts = i18n.__datetimeParts(...[props.value, options, orverrides])

      let children = [options.key] as VNodeArrayChildren
      if (isArray(parts)) {
        children = parts.map((part, index) => {
          const slot = slots[part.type]
          return slot
            ? slot({ [part.type]: part.value, index, parts })
            : [part.value]
        })
      } else if (isString(parts)) {
        children = [parts]
      }

      return props.tag
        ? h(props.tag, { ...attrs }, children)
        : h('span', { ...attrs }, children)
    }
  }
})
