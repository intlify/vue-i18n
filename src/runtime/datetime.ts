import { RuntimeContext } from './context'

export type IntlAvailability = {
  dateTimeFormat: boolean
  numberFormat: boolean
}

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
