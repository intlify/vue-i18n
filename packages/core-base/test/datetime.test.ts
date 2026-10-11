// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})

// runtime/types
import { Availabilities } from '../src/intl'
vi.mock('../src/intl', async () => {
  const actual = await vi.importActual<object>('../src/intl')
  return {
    ...actual,
    Availabilities: vi.fn()
  }
})

import { compile } from '../src/compilation'
import { createCoreContext, NOT_RESOLVED, updateFallbackLocale } from '../src/context'
import { datetime } from '../src/datetime'
import { CoreErrorCodes, errorMessages } from '../src/errors'
import { fallbackWithLocaleChain } from '../src/fallbacker'

import type { DateTimeFormats } from '../src/types'

function context(options: any = {}) {
  return createCoreContext({
    messageCompiler: compile,
    localeFallbacker: fallbackWithLocaleChain,
    ...options
  })
}

type MyDateTimeSchema = {
  short: {} // loose schema
  long: {} // loose schema
}

const datetimeFormats: DateTimeFormats<MyDateTimeSchema, 'en-US' | 'ja-JP'> = {
  // @ts-ignore NOTE: checking fallback tests
  'en-US': {
    short: {
      // DD/MM/YYYY, hh:mm (AM|PM)
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/New_York'
    }
  },
  'ja-JP': {
    long: {
      // YYYY/MM/DD hh:mm:ss
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Tokyo'
    },
    short: {
      // YYYY/MM/DD hh:mm
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tokyo'
    }
  }
}

const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
const dts = [
  '2012-12-20 03:00',
  '2012-12-20  03:00',
  '2012-12-20 03:00:00',
  '2012-12-20  03:00:00',
  '2012-12-20T03:00',
  '2012-12-20 T03:00',
  '2012-12-20T03:00:00',
  '2012-12-20 T03:00:00'
]

afterEach(() => {
  vi.clearAllMocks()
})

test('datetime value', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt)).toEqual('12/20/2012')
})

test('number value', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt.getTime())).toEqual('12/20/2012')
})

test('key argument', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'short')).toEqual('12/19/2012, 10:00 PM')
  dts.forEach(dt => {
    expect(datetime(ctx, dt, 'short')).toEqual('12/19/2012, 10:00 PM')
  })
})

test('locale argument', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'short', 'ja-JP')).toEqual('2012/12/20 12:00')
  dts.forEach(dt => {
    expect(datetime(ctx, dt, 'short', 'ja-JP')).toEqual('2012/12/20 12:00')
  })
})

test('with object argument', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, { key: 'short', locale: 'ja-JP' })).toEqual('2012/12/20 12:00')
})

test('override format options with number function options', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'short', { year: '2-digit' })).toEqual('12/19/12, 10:00 PM')
  expect(datetime(ctx, dt, 'short', 'ja-JP', { year: '2-digit' })).toEqual('12/12/20 12:00')
  expect(datetime(ctx, dt, { key: 'short', locale: 'ja-JP' }, { year: '2-digit' })).toEqual(
    '12/12/20 12:00'
  )
  expect(datetime(ctx, dt, { key: 'short', locale: 'ja-JP', year: '2-digit' })).toEqual(
    '12/12/20 12:00'
  )
})

test('fallback', () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    missingWarn: false,
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'long')).toEqual('2012/12/20 12:00:00')
  expect(mockWarn).toHaveBeenCalledTimes(2)
  expect(mockWarn.mock.calls[0][0]).toEqual(
    `Fall back to datetime format 'long' key with 'en' locale.`
  )
  expect(mockWarn.mock.calls[1][0]).toEqual(
    `Fall back to datetime format 'long' key with 'ja-JP' locale.`
  )
})

test(`context fallbackWarn 'false' option`, () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    fallbackWarn: false,
    missingWarn: false,
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'long')).toEqual('2012/12/20 12:00:00')
  dts.forEach(dt => {
    expect(datetime(ctx, dt, 'long')).toEqual('2012/12/20 12:00:00')
  })
  expect(mockWarn).not.toHaveBeenCalled()
})

test(`datetime function fallbackWarn 'false' option`, () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    missingWarn: false,
    datetimeFormats
  })

  expect(datetime(ctx, dt, { key: 'long', fallbackWarn: false })).toEqual('2012/12/20 12:00:00')
  expect(mockWarn).not.toHaveBeenCalled()
})

describe('context unresolving option', () => {
  test('not specify fallbackLocales', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({
      locale: 'en-US',
      fallbackWarn: false,
      missingWarn: false,
      unresolving: true,
      datetimeFormats
    })

    expect(datetime(ctx, dt, 'long')).toEqual(NOT_RESOLVED)
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('not found key in fallbackLocales', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({
      locale: 'en-US',
      fallbackLocale: ['ja-JP'],
      fallbackWarn: false,
      missingWarn: false,
      unresolving: true,
      datetimeFormats
    })

    expect(datetime(ctx, dt, 'custom')).toEqual(NOT_RESOLVED)
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

test('part', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    datetimeFormats
  })

  expect(datetime(ctx, dt, { key: 'short', locale: 'ja-JP', part: true })).toEqual([
    { type: 'year', value: '2012' },
    { type: 'literal', value: '/' },
    { type: 'month', value: '12' },
    { type: 'literal', value: '/' },
    { type: 'day', value: '20' },
    { type: 'literal', value: ' ' },
    { type: 'hour', value: '12' },
    { type: 'literal', value: ':' },
    { type: 'minute', value: '00' }
  ])
})

test('part without key', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    datetimeFormats
  })

  expect(datetime(ctx, dt, { year: 'numeric', timeZone: 'UTC', part: true })).toEqual([
    { type: 'year', value: '2012' }
  ])
})

test('not available Intl API', () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = false

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'short')).toEqual('')
  expect(mockWarn.mock.calls[0][0]).toEqual(
    `Cannot format a date value due to not supported Intl.DateTimeFormat.`
  )
})

describe('error', () => {
  test(errorMessages[CoreErrorCodes.INVALID_ARGUMENT], () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true
    const ctx = context({
      locale: 'en-US',
      datetimeFormats
    })
    expect(() => {
      datetime(ctx, '111')
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT])

    expect(() => {
      datetime(ctx, 'x2020-01-01')
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT])

    for (const value of ['2020-01-01\n', '2020-01-01 ', '2020-01-01\t', '2020-01-01T']) {
      expect(() => {
        datetime(ctx, value)
      }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT])
    }

    expect(() => {
      datetime(ctx, '2020-01-01TSomeDefinitelyInvalidString')
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT])

    // Non-date/number/string arguments return empty string with warning instead of throwing
    expect(datetime(ctx, { someObject: true } as any)).toBe('')
    expect(datetime(ctx, undefined as any)).toBe('')
    expect(datetime(ctx, null as any)).toBe('')
    expect(mockWarn).toHaveBeenCalled()

    expect(() => {
      datetime(ctx, new Date('invalid'))
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_DATE_ARGUMENT])
  })

  test('locale with ! suffix should not break datetime formatting', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true
    const ctx = context({
      locale: 'en-US!',
      datetimeFormats
    })
    // Should not throw RangeError for locale with ! suffix
    expect(() => datetime(ctx, new Date())).not.toThrow()
  })
})

test('locale named after an Object.prototype property', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'constructor',
    fallbackLocale: 'en-US',
    missingWarn: false,
    fallbackWarn: false,
    datetimeFormats
  })
  // `Object.prototype` is a plain object, but not a format of the `constructor` locale
  expect(datetime(ctx, dt, 'prototype')).toEqual('prototype')
  expect(datetime(ctx, dt, 'short')).toEqual(
    datetime(context({ locale: 'en-US', datetimeFormats }), dt, 'short')
  )
})

describe('locale that is not a language tag', () => {
  test('falls back to the first language tag in the locale chain', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({
      locale: 'ja_JP',
      fallbackLocale: 'en-US',
      datetimeFormats: { ja_JP: datetimeFormats['ja-JP'] }
    })
    // `Intl.DateTimeFormat` throws a RangeError for `ja_JP`
    expect(datetime(ctx, dt)).toEqual(new Intl.DateTimeFormat('en-US').format(dt))
    expect(datetime(ctx, dt, 'long')).toEqual(
      new Intl.DateTimeFormat('en-US', datetimeFormats['ja-JP'].long).format(dt)
    )
    expect(mockWarn).toHaveBeenCalledWith(
      `Fall back to 'en-US' locale for datetime formatting with 'ja_JP' locale: it is not a BCP 47 language tag`
    )
  })

  test('falls back to the default locale without a language tag in the locale chain', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({ locale: 'ja_JP' })
    expect(datetime(ctx, dt)).toEqual(new Intl.DateTimeFormat('en-US').format(dt))
  })

  test('uses the new locale chain after updateFallbackLocale()', () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({
      locale: 'ja_JP',
      fallbackLocale: 'en-US',
      datetimeFormats: { ja_JP: datetimeFormats['ja-JP'] }
    })
    expect(datetime(ctx, dt, 'long')).toEqual(
      new Intl.DateTimeFormat('en-US', datetimeFormats['ja-JP'].long).format(dt)
    )
    ctx.fallbackLocale = 'de-DE'
    updateFallbackLocale(ctx, 'ja_JP', 'de-DE')
    expect(datetime(ctx, dt, 'long')).toEqual(
      new Intl.DateTimeFormat('de-DE', datetimeFormats['ja-JP'].long).format(dt)
    )
  })

  test('throws an error of the options', () => {
    const mockAvailabilities = Availabilities
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({ locale: 'en-US' })
    expect(() => datetime(ctx, dt, { timeZone: 'Invalid/Zone' })).toThrow(RangeError)
  })
})
