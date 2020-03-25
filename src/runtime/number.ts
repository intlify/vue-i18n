import { RuntimeContext } from './context'

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
