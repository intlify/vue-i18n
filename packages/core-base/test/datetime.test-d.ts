import { createCoreContext, datetime } from '../src'

test('datetime type check', () => {
  const ctx = createCoreContext({
    locale: 'en-US',
    datetimeFormats: {
      'en-US': {
        short: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/New_York'
        }
      }
    }
  })

  const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))

  expectTypeOf(datetime(ctx, dt)).toEqualTypeOf<
    string | number | Intl.DateTimeFormatPart[]
  >()
  expectTypeOf(
    datetime(ctx, dt, { locale: 'en-US', key: 'short' })
  ).toEqualTypeOf<string | number | Intl.DateTimeFormatPart[]>()
  expectTypeOf(datetime(ctx, dt, { key: 'short' }, 'en-US')).toEqualTypeOf<
    string | number | Intl.DateTimeFormatPart[]
  >()
  expectTypeOf(
    datetime(ctx, dt, { key: 'short' }, { hourCycle: 'h24' })
  ).toEqualTypeOf<string | number | Intl.DateTimeFormatPart[]>()
  expectTypeOf(
    datetime(ctx, dt, { key: 'short' }, 'en-US', { hourCycle: 'h24' })
  ).toEqualTypeOf<string | number | Intl.DateTimeFormatPart[]>()
})
