import { RuntimeContext } from './context'

export type CurrencyDisplay = 'symbol' | 'code' | 'name'

export interface SpecificNumberFormatOptions extends Intl.NumberFormatOptions {
  style?: 'decimal' | 'percent'
  currency?: string
  currencyDisplay?: CurrencyDisplay
  localeMatcher?: 'lookup' | 'best-fit'
  formatMatcher?: 'basic' | 'best-fit'
}

export interface CurrencyNumberFormatOptions extends Intl.NumberFormatOptions {
  style: 'currency'
  currency: string // Obligatory if style is 'currency'
  currencyDisplay?: CurrencyDisplay
  localeMatcher?: 'lookup' | 'best-fit'
  formatMatcher?: 'basic' | 'best-fit'
}

export type NumberFormatOptions =
  | Intl.NumberFormatOptions
  | SpecificNumberFormatOptions
  | CurrencyNumberFormatOptions
export type NumberFormat = { [key: string]: NumberFormatOptions }
export type NumberFormats = { [locale: string]: NumberFormat }
export type NumberFormatResult = string

/*
 * number
 *
 * usages:
 *    'currency': {
 *      style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
 *    }
 *
 *    // value only
 *    number(context, value)
 *
 *    // key argument
 *    number(context, value, 'currency')
 *
 *    // key & locale argument
 *    number(context, value, 'currency', 'ja-JP')
 *
 *    // object sytle argument
 *    number(context, value, { key: 'currency', locale: 'ja-JP' })
 */

export function number (context: RuntimeContext, value: number, ...args: unknown[]): string {
  // TODO:
  return ''
}
