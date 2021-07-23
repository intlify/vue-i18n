import type { LocaleRecord, UnionToTuple } from './utils'
import type { Locale } from '../runtime'

/**
 *  datetime
 */

export type DateTimeHumanReadable = 'long' | 'short' | 'narrow'
export type DateTimeDigital = 'numeric' | '2-digit'
export type LocaleMatcher = 'lookup' | 'best fit'
export type FormatMatcher = 'basic' | 'best fit'

export interface SpecificDateTimeFormatOptions
  extends Intl.DateTimeFormatOptions {
  year?: DateTimeDigital
  month?: DateTimeDigital | DateTimeHumanReadable
  day?: DateTimeDigital
  hour?: DateTimeDigital
  minute?: DateTimeDigital
  second?: DateTimeDigital
  weekday?: DateTimeHumanReadable
  era?: DateTimeHumanReadable
  timeZoneName?: 'long' | 'short'
  localeMatcher?: LocaleMatcher
  formatMatcher?: FormatMatcher
}
export type DateTimeFormatOptions =
  | Intl.DateTimeFormatOptions
  | SpecificDateTimeFormatOptions
export type DateTimeFormat = { [key: string]: DateTimeFormatOptions }
export type DateTimeFormats<Schema = DateTimeFormat, Locales = Locale> = LocaleRecord<UnionToTuple<Locales>, Schema>

/**
 *  number
 */

export type CurrencyDisplay = 'symbol' | 'code' | 'name'

export interface SpecificNumberFormatOptions extends Intl.NumberFormatOptions {
  style?: 'decimal' | 'percent'
  currency?: string
  currencyDisplay?: CurrencyDisplay
  localeMatcher?: LocaleMatcher
  formatMatcher?: FormatMatcher
}

export interface CurrencyNumberFormatOptions extends Intl.NumberFormatOptions {
  style: 'currency'
  currency: string // Obligatory if style is 'currency'
  currencyDisplay?: CurrencyDisplay
  localeMatcher?: LocaleMatcher
  formatMatcher?: FormatMatcher
}

export type NumberFormatOptions =
  | Intl.NumberFormatOptions
  | SpecificNumberFormatOptions
  | CurrencyNumberFormatOptions
export type NumberFormat = { [key: string]: NumberFormatOptions }
export type NumberFormats<Schema = NumberFormat, Locales = Locale> = LocaleRecord<UnionToTuple<Locales>, Schema>

export type FormattedNumberPartType =
  | 'currency'
  | 'decimal'
  | 'fraction'
  | 'group'
  | 'infinity'
  | 'integer'
  | 'literal'
  | 'minusSign'
  | 'nan'
  | 'plusSign'
  | 'percentSign'

export type FormattedNumberPart = {
  type: FormattedNumberPartType
  value: string
}
export type NumberFormatToPartsResult = { [index: number]: FormattedNumberPart }