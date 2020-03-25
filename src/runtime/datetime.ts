import { RuntimeContext } from './context'

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
export type DateTimeFormatResult = string
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

const intlDefined = typeof Intl !== 'undefined'
export const Availabilities = {
  dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== 'undefined',
  numberFormat: intlDefined && typeof Intl.NumberFormat !== 'undefined'
} as IntlAvailability

/*
 * datetime
 *
 * usages:
 *    'short': {
 *      year: 'numeric', month: '2-digit', day: '2-digit',
 *      hour: '2-digit', minute: '2-digit'
 *    }
 *
 *    // datetimeable value only
 *    datetime(context, value)
 *
 *    // key argument
 *    datetime(context, value, 'short')
 *
 *    // key & locale argument
 *    datetime(context, value, 'short', 'ja-JP')
 *
 *    // object sytle argument
 *    datetime(context, value, { key: 'short', locale: 'ja-JP' })
 */

export function datetime (context: RuntimeContext, value: number | Date, ...args: unknown[]): string {
  // TODO:
  return ''
}
