import { expectType } from '../index'

import { createCoreContext, number } from '../../packages/core-base/src'

const ctx = createCoreContext({
  locale: 'en-US',
  numberFormats: {
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD',
        currencyDisplay: 'symbol'
      }
    }
  }
})

expectType<string | number | Intl.NumberFormatPart[]>(number(ctx, 10100))
expectType<string | number | Intl.NumberFormatPart[]>(
  number(ctx, 10100, { locale: 'en-US', key: 'currency' })
)
expectType<string | number | Intl.NumberFormatPart[]>(
  number(ctx, 10100, { key: 'currency' }, 'en-US')
)
expectType<string | number | Intl.NumberFormatPart[]>(
  number(ctx, 10100, { locale: 'en-US', key: 'currency' }, { unit: '' })
)
expectType<string | number | Intl.NumberFormatPart[]>(
  number(ctx, 10100, { key: 'currency' }, 'en-US', { unit: '' })
)
