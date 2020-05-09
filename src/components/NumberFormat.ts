import { defineComponent, SetupContext } from 'vue'
import { useI18n } from '../i18n'
import { NumberOptions } from '../core'
import { Composer, ComposerInternal } from '../composer'
import { renderFormatter, FormattableProps } from './formatRenderer'

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
  /* eslint-disable */
  name: 'i18n-n',
  props: {
    tag: {
      type: String
    },
    value: {
      type: Number,
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
      FormattableProps<number, Intl.NumberFormatOptions>,
      number,
      Intl.NumberFormatOptions,
      NumberOptions,
      Intl.NumberFormatPart
    >(props, context, NUMBER_FORMAT_KEYS, (...args: unknown[]) =>
      i18n.__numberParts(...args)
    )
  }
})
