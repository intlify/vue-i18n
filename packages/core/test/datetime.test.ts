/* eslint-disable @typescript-eslint/no-empty-function */

// utils
jest.mock('@intlify/shared', () => ({
  ...jest.requireActual<object>('@intlify/shared'),
  warn: jest.fn()
}))
import { warn } from '@intlify/shared'

// runtime/types
jest.mock('../src/intl', () => ({
  ...jest.requireActual<object>('../src/intl'),
  Availabilities: jest.fn()
}))
import { Availabilities } from '../src/intl'

import { createRuntimeContext as context, NOT_REOSLVED } from '../src/context'
import { datetime } from '../src/datetime'
import { CoreErrorCodes, errorMessages } from '../src/errors'

const datetimeFormats = {
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

test('datetime value', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt)).toEqual('12/20/2012')
})

test('number value', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt.getTime())).toEqual('12/20/2012')
})

test('key argument', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'short')).toEqual('12/19/2012, 10:00 PM')
})

test('locale argument', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'short', 'ja-JP')).toEqual('2012/12/20 12:00')
})

test('with object argument', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, { key: 'short', locale: 'ja-JP' })).toEqual(
    '2012/12/20 12:00'
  )
})

test('override format options with number function options', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'short', { year: '2-digit' })).toEqual(
    '12/19/12, 10:00 PM'
  )
  expect(datetime(ctx, dt, 'short', 'ja-JP', { year: '2-digit' })).toEqual(
    '12/12/20 12:00'
  )
  expect(
    datetime(ctx, dt, { key: 'short', locale: 'ja-JP' }, { year: '2-digit' })
  ).toEqual('12/12/20 12:00')
})

test('fallback', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
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
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    fallbackWarn: false,
    missingWarn: false,
    datetimeFormats
  })

  expect(datetime(ctx, dt, 'long')).toEqual('2012/12/20 12:00:00')
  expect(mockWarn).not.toHaveBeenCalled()
})

test(`datetime function fallbackWarn 'false' option`, () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    missingWarn: false,
    datetimeFormats
  })

  expect(datetime(ctx, dt, { key: 'long', fallbackWarn: false })).toEqual(
    '2012/12/20 12:00:00'
  )
  expect(mockWarn).not.toHaveBeenCalled()
})

describe('context unresolving option', () => {
  test('not specify fallbackLocales', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities as jest.Mocked<
      typeof Availabilities
    >
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({
      locale: 'en-US',
      fallbackWarn: false,
      missingWarn: false,
      unresolving: true,
      datetimeFormats
    })

    expect(datetime(ctx, dt, 'long')).toEqual(NOT_REOSLVED)
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('not found key in fallbackLocales', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities as jest.Mocked<
      typeof Availabilities
    >
    mockAvailabilities.dateTimeFormat = true

    const ctx = context({
      locale: 'en-US',
      fallbackLocale: ['ja-JP'],
      fallbackWarn: false,
      missingWarn: false,
      unresolving: true,
      datetimeFormats
    })

    expect(datetime(ctx, dt, 'custom')).toEqual(NOT_REOSLVED)
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

test('part', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.dateTimeFormat = true

  const ctx = context({
    locale: 'en-US',
    datetimeFormats
  })

  expect(
    datetime(ctx, dt, { key: 'short', locale: 'ja-JP', part: true })
  ).toEqual([
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

test('not available Intl API', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
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
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities as jest.Mocked<
      typeof Availabilities
    >
    mockAvailabilities.dateTimeFormat = true
    const ctx = context({
      locale: 'en-US',
      datetimeFormats
    })
    expect(() => {
      datetime(ctx, '111')
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT])

    expect(() => {
      datetime(ctx, '2020-01-01TSomeDefinitelyInvalidString')
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT])

    expect(() => {
      datetime(ctx, { someObject: true })
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ARGUMENT])

    expect(() => {
      datetime(ctx, new Date('invalid'))
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_DATE_ARGUMENT])
  })
})

/* eslint-eable @typescript-eslint/no-empty-function */
