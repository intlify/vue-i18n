/* eslint-disable @typescript-eslint/no-empty-function */

// utils
jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../../src/utils'

// runtime/types
jest.mock('../../src/core/types', () => ({
  ...jest.requireActual('../../src/core/types'),
  Availabilities: jest.fn()
}))
import { Availabilities } from '../../src/core/types'

import {
  createRuntimeContext as context,
  NOT_REOSLVED
} from '../../src/core/context'
import { number } from '../../src/core/number'

const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    },
    decimal: {
      style: 'decimal',
      useGrouping: false
    }
  },
  'ja-JP': {
    currency: {
      style: 'currency',
      currency: 'JPY' /*, currencyDisplay: 'symbol'*/
    },
    numeric: {
      style: 'decimal',
      useGrouping: false
    },
    percent: {
      style: 'percent',
      useGrouping: false
    }
  }
}

test('value argument only', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 10100)).toEqual('10,100')
})

test('key argument', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 10100, 'currency')).toEqual('$10,100.00')
})

test('locale argument', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 10100, 'currency', 'ja-JP')).toEqual('￥10,100')
})

test('with object argument', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 10100, { key: 'currency', locale: 'ja-JP' })).toEqual(
    '￥10,100'
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
    numberFormats
  })

  expect(number(ctx, 10100, 'currency', { currency: 'EUR' })).toEqual(
    '€10,100.00'
  )
  expect(number(ctx, 10100, 'currency', 'ja-JP', { currency: 'EUR' })).toEqual(
    '€10,100.00'
  )
  expect(
    number(
      ctx,
      10100,
      { key: 'currency', locale: 'ja-JP' },
      { currency: 'EUR' }
    )
  ).toEqual('€10,100.00')
})

test('fallback', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    missingWarn: false,
    numberFormats
  })

  expect(number(ctx, 0.99, 'percent')).toEqual('99%')
  expect(mockWarn).toHaveBeenCalledTimes(2)
  expect(mockWarn.mock.calls[0][0]).toEqual(
    `Fall back to number format 'percent' key with 'en' locale.`
  )
  expect(mockWarn.mock.calls[1][0]).toEqual(
    `Fall back to number format 'percent' key with 'ja-JP' locale.`
  )
})

test(`context fallbackWarn 'false' option`, () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    missingWarn: false,
    fallbackWarn: false,
    numberFormats
  })

  expect(number(ctx, 0.99, 'percent')).toEqual('99%')
  expect(mockWarn).not.toHaveBeenCalled()
})

test(`number function fallbackWarn 'false' option`, () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    missingWarn: false,
    numberFormats
  })

  expect(number(ctx, 0.99, { key: 'percent', fallbackWarn: false })).toEqual(
    '99%'
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
    mockAvailabilities.numberFormat = true

    const ctx = context({
      locale: 'en-US',
      missingWarn: false,
      fallbackWarn: false,
      unresolving: true,
      numberFormats
    })

    expect(number(ctx, 0.99, 'percent')).toEqual(NOT_REOSLVED)
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('not found key in fallbackLocales', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities as jest.Mocked<
      typeof Availabilities
    >
    mockAvailabilities.numberFormat = true

    const ctx = context({
      locale: 'en-US',
      fallbackLocale: ['ja-JP'],
      missingWarn: false,
      fallbackWarn: false,
      unresolving: true,
      numberFormats
    })

    expect(number(ctx, 123456789, 'custom')).toEqual(NOT_REOSLVED)
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

test('part', () => {
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    numberFormats
  })

  expect(
    number(ctx, 10100, { key: 'currency', locale: 'ja-JP', part: true })
  ).toEqual([
    { type: 'currency', value: '￥' },
    { type: 'integer', value: '10' },
    { type: 'group', value: ',' },
    { type: 'integer', value: '100' }
  ])
})

test('not available Intl API', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities as jest.Mocked<
    typeof Availabilities
  >
  mockAvailabilities.numberFormat = false

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 100, 'currency')).toEqual('')
  expect(mockWarn.mock.calls[0][0]).toEqual(
    `Cannot format a Date value due to not supported Intl.NumberFormat.`
  )
})

/* eslint-enable @typescript-eslint/no-empty-function */
