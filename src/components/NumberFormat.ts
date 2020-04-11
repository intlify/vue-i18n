import { h, defineComponent, SetupContext, VNodeArrayChildren } from 'vue'
import { useI18n } from '../i18n'
import { NumberOptions } from '../runtime'
import { isString, isPlainObject, isArray } from '../utils'

const NUMBER_FORMAT_KEYS = [
  'localeMatcher',
  'style',
  'unit',
  'unitDisplay',
  'currency',
  'currencyDisplay',
  'useGrouping',
  'numberingSystem',
  'minimumIntegerDigits',
  'minimumFractionDigits',
  'maximumFractionDigits',
  'minimumSignificantDigits',
  'maximumSignificantDigits',
  'notation',
  'formatMatcher'
]

export const NumberFormat = defineComponent({
  name: 'i18n-n',
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
      const options = { part: true } as NumberOptions
      let orverrides = {} as Intl.NumberFormatOptions

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
        // Filter out number format options only
        orverrides = Object.keys(props.format).reduce((options, prop) => {
          return NUMBER_FORMAT_KEYS.includes(prop)
            ? Object.assign({}, options, { [prop]: props.format[prop] })
            : options
        }, {})
      }

      const parts = i18n.__numberParts(...[props.value, options, orverrides])
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
