import { Availabilities, NumberFormat } from './types'
import {
  RuntimeContext,
  Locale,
  fallback,
  MISSING_RESOLVE_VALUE
} from './context'
import {
  warn,
  isString,
  isBoolean,
  isArray,
  isPlainObject,
  isNumber
} from '../utils'

/**
 *  # number
 *
 *  ## usages
 *    // for example `context.numberFormats` below
 *    'en-US': {
 *      'currency': {
 *        style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
 *      }
 *    },
 *    'ja-JP: { ... }
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
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    number(context, value, { key: 'currency', locale: 'ja-JP', fallbackWarn: false })
 */

export type NumberOptions = {
  key?: string
  locale?: Locale
  fallbackWarn?: boolean
}

// `number` function overloads
export function number(context: RuntimeContext, value: number): string | number
export function number(
  context: RuntimeContext,
  value: number,
  key: string
): string | number
export function number(
  context: RuntimeContext,
  value: number,
  key: string,
  locale: Locale
): string | number
export function number(
  context: RuntimeContext,
  value: number,
  options: NumberOptions
): string | number

// implementationo of `number` function
export function number(
  context: RuntimeContext,
  ...args: unknown[]
): string | number {
  const { numberFormats, _numberFormatters, _fallbackLocaleStack } = context

  if (__DEV__ && !Availabilities.numberFormat) {
    warn(`Cannot format a Date value due to not supported Intl.NumberFormat.`)
    return MISSING_RESOLVE_VALUE
  }

  const [value, options] = parseNumberArgs(...args)
  const { key } = options
  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn
  let locale = isString(options.locale) ? options.locale : context.locale
  // override with fallback locales
  if (isArray(_fallbackLocaleStack) && _fallbackLocaleStack.length > 0) {
    locale = _fallbackLocaleStack.shift() || locale
  }

  if (!isString(key)) {
    return new Intl.NumberFormat(locale).format(value)
  }

  const numberFormat = numberFormats[locale]
  if (!numberFormat) {
    return fallback(
      context,
      key,
      fallbackWarn,
      'number format',
      (context: RuntimeContext): string | number =>
        number(context, value, options)
    )
  }

  const format = numberFormat[key]
  if (!format) {
    return fallback(
      context,
      key,
      fallbackWarn,
      'number format',
      (context: RuntimeContext): string | number =>
        number(context, value, options)
    )
  }

  const id = `${locale}__${key}`
  let formatter = _numberFormatters.get(id)
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, format)
    _numberFormatters.set(id, formatter)
  }
  return formatter.format(value)
}

export function parseNumberArgs(...args: unknown[]): [number, NumberOptions] {
  const [arg1, arg2, arg3] = args
  let options = {} as NumberOptions

  if (!isNumber(arg1)) {
    throw new Error('TODO')
  }
  const value = arg1

  if (isString(arg2)) {
    options.key = arg2
  } else if (isPlainObject(arg2)) {
    options = arg2
  }

  if (isString(arg3)) {
    options.locale = arg3
  }

  return [value, options]
}

export function clearNumberFormat(
  context: RuntimeContext,
  locale: Locale,
  format: NumberFormat
): void {
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context._numberFormatters.has(id)) {
      continue
    }
    context._numberFormatters.delete(id)
  }
}
