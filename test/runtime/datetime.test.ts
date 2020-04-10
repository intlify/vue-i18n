// utils
jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../../src/utils'

// runtime/types
jest.mock('../../src/runtime/types', () => ({
  ...jest.requireActual('../../src/runtime/types'),
  Availabilities: jest.fn()
}))
import { Availabilities } from '../../src/runtime/types'

import {
  createRuntimeContext as context,
  NOT_REOSLVED
} from '../../src/runtime/context'
import { datetime } from '../../src/runtime/datetime'

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

test('fallback', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function
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
  mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function
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
  mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function
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
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function
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
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function
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

test('not available Intl API', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function
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
    `Cannot format a Date value due to not supported Intl.DateTimeFormat.`
  )
})
