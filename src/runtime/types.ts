/**
 *  datetime format
 */

export type IntlAvailability = {
  dateTimeFormat: boolean
  numberFormat: boolean
}

export type DateTimeHumanReadable = 'long' | 'short' | 'narrow'
export type DateTimeDigital = 'numeric' | '2-digit'

export interface SpecificDateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  year?: DateTimeDigital
  month?: DateTimeDigital | DateTimeHumanReadable
  day?: DateTimeDigital
  hour?: DateTimeDigital
  minute?: DateTimeDigital
  second?: DateTimeDigital
  weekday?: DateTimeHumanReadable
  era?: DateTimeHumanReadable
  timeZoneName?: 'long' | 'short'
  localeMatcher?: 'lookup' | 'best-fit'
  formatMatcher?: 'basic' | 'best-fit'
}
export type DateTimeFormatOptions = Intl.DateTimeFormatOptions | SpecificDateTimeFormatOptions
export type DateTimeFormat = { [key: string]: DateTimeFormatOptions }
export type DateTimeFormats = { [locale: string]: DateTimeFormat }

/**
 *  number format
 */

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
