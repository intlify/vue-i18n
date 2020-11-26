import { SetupContext, RenderFunction } from 'vue'
import { useI18n } from '../i18n'
import { NumberOptions } from '../core'
import { Composer, ComposerInternal, NumberPartsSymbol } from '../composer'
import { renderFormatter, FormattableProps } from './formatRenderer'
import { baseFormatProps } from './base'

/**
 * NumberFormat Component Props
 *
 * @VueI18nComponent
 */
export type NumberFormatProps = FormattableProps<
  number,
  Intl.NumberFormatOptions
>

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

/**
 * Number Format Component
 *
 * @VueI18nComponent
 */
export const NumberFormat = {
  /* eslint-disable */
  name: 'i18n-n',
  props: {
    ...baseFormatProps,
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  },
  /* eslint-enable */
  setup(props: NumberFormatProps, context: SetupContext): RenderFunction {
    const i18n = useI18n({ useScope: 'parent' }) as Composer & ComposerInternal

    return renderFormatter<
      FormattableProps<number, Intl.NumberFormatOptions>,
      number,
      Intl.NumberFormatOptions,
      NumberOptions,
      Intl.NumberFormatPart
    >(props, context, NUMBER_FORMAT_KEYS, (...args: unknown[]) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (i18n as any)[NumberPartsSymbol](...args)
    )
  }
}
