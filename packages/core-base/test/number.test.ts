/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any */

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
import {
  createCoreContext as context,
  NOT_REOSLVED,
  registerLocaleFallbacker,
  registerMessageCompiler
} from '../src/context'
import { CoreErrorCodes, errorMessages } from '../src/errors'
import { fallbackWithLocaleChain } from '../src/fallbacker'
import { number } from '../src/number'

import type { NumberFormats } from '../src/types/index'

type MyNumberSchema = {
  currency: {} // loose schema
  decimal: {} // loose schema
  percent: {} // loose schema
  numeric: {} // loose schema
}

const numberFormats: NumberFormats<MyNumberSchema, 'en-US' | 'ja-JP'> = {
  // @ts-ignore NOTE: checking fallback tests
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
  // @ts-ignore NOTE: checking fallback tests
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

beforeEach(() => {
  registerMessageCompiler(compile)
  registerLocaleFallbacker(fallbackWithLocaleChain)
})

test('value argument only', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 10100)).toEqual('10,100')
})

test('key argument', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 10100, 'currency')).toEqual('$10,100.00')
})

test('locale argument', () => {
  const mockAvailabilities = Availabilities
  mockAvailabilities.numberFormat = true

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 10100, 'currency', 'ja-JP')).toEqual('￥10,100')
})

test('with object argument', () => {
  const mockAvailabilities = Availabilities
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
  const mockAvailabilities = Availabilities
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
  expect(
    number(ctx, 10100, { key: 'currency', locale: 'ja-JP', currency: 'EUR' })
  ).toEqual('€10,100.00')
  expect(
    number(ctx, 123456.789, {
      style: 'currency',
      currency: 'USD',
      signDisplay: 'always'
    })
  ).toEqual('+$123,456.79')
})

test('fallback', () => {
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
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
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
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
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
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
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
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
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
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
  const mockAvailabilities = Availabilities
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
  const mockWarn = vi.spyOn(shared, 'warn')
  mockWarn.mockImplementation(() => {})
  const mockAvailabilities = Availabilities
  mockAvailabilities.numberFormat = false

  const ctx = context({
    locale: 'en-US',
    fallbackLocale: ['ja-JP'],
    numberFormats
  })

  expect(number(ctx, 100, 'currency')).toEqual('')
  expect(mockWarn.mock.calls[0][0]).toEqual(
    `Cannot format a number value due to not supported Intl.NumberFormat.`
  )
})

describe('error', () => {
  test(errorMessages[CoreErrorCodes.INVALID_ARGUMENT], () => {
    const mockWarn = vi.spyOn(shared, 'warn')
    mockWarn.mockImplementation(() => {})
    const mockAvailabilities = Availabilities
    mockAvailabilities.numberFormat = true
    const ctx = context({
      locale: 'en-US',
      numberFormats
    })
    expect(() => {
      number(ctx, '111' as any)
    }).toThrowError(errorMessages[CoreErrorCodes.INVALID_ARGUMENT])
  })
})

/* eslint-enable @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any */
