import { createCoreContext, number } from '../src'

test('number type check', () => {
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

  expectTypeOf(number(ctx, 10100)).toEqualTypeOf<
    string | number | Intl.NumberFormatPart[]
  >()
  expectTypeOf(
    number(ctx, 10100, { locale: 'en-US', key: 'currency' })
  ).toEqualTypeOf<string | number | Intl.NumberFormatPart[]>()
  expectTypeOf(number(ctx, 10100, { key: 'currency' }, 'en-US')).toEqualTypeOf<
    string | number | Intl.NumberFormatPart[]
  >()
  expectTypeOf(
    number(ctx, 10100, { locale: 'en-US', key: 'currency' }, { unit: '' })
  ).toEqualTypeOf<string | number | Intl.NumberFormatPart[]>()
  expectTypeOf(
    number(ctx, 10100, { key: 'currency' }, 'en-US', { unit: '' })
  ).toEqualTypeOf<string | number | Intl.NumberFormatPart[]>()
})
