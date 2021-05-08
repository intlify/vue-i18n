/* eslint-disable @typescript-eslint/no-explicit-any */
import { expectType } from '../index'

import { createCoreContext } from '../../packages/core-base/src/context'
import { datetime } from '../../packages/core-base/src/datetime'

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

expectType<string | number | Intl.DateTimeFormatPart[]>(datetime(ctx, dt))
expectType<string | number | Intl.DateTimeFormatPart[]>(
  datetime(ctx, dt, { locale: 'en-US', key: 'short' })
)
expectType<string | number | Intl.DateTimeFormatPart[]>(
  datetime(ctx, dt, { key: 'short' }, 'en-US')
)
expectType<string | number | Intl.DateTimeFormatPart[]>(
  datetime(ctx, dt, { key: 'short' }, { hourCycle: 'h24' })
)
expectType<string | number | Intl.DateTimeFormatPart[]>(
  datetime(ctx, dt, { key: 'short' }, 'en-US', { hourCycle: 'h24' })
)

/* eslint-enable @typescript-eslint/no-explicit-any */
