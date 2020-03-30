import { Availabilities, NumberFormat } from './types'
import {
  RuntimeContext,
  Locale,
  fallback,
  MISSING_RESOLVE_VALUE
} from './context'
import { warn, isString, isBoolean, isArray, isPlainObject } from '../utils'

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
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    number(context, value, { key: 'currency', locale: 'ja-JP', fallbackWarn: false })
 */

export type NumberOptions = {
  key?: string
  locale?: Locale,
  fallbackWarn?: boolean
}

export function number (context: RuntimeContext, value: number, ...args: unknown[]): string | number {
  const { numberFormats, _numberFormatters, _fallbackLocaleStack } = context

  if (__DEV__ && !Availabilities.numberFormat) {
    warn(`Cannot format a Date value due to not supported Intl.NumberFormat.`)
    return MISSING_RESOLVE_VALUE
  }

  const options = parseNumberArgs(...args)
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
      (context: RuntimeContext): string | number => number(context, value, ...args)
    )
  }

  const format = numberFormat[key]
  if (!format) {
    return fallback(
      context,
      key,
      fallbackWarn,
      'number format',
      (context: RuntimeContext): string | number => number(context, value, ...args)
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

export function parseNumberArgs (...args: unknown[]): NumberOptions {
  const [arg1, arg2] = args
  let options = {} as NumberOptions

  if (isString(arg1)) {
    options.key = arg1
  } else if (isPlainObject(arg1)) {
    options = arg1
  }

  if (isString(arg2)) {
    options.locale = arg2
  }

  return options
}

export function clearNumberFormat (context: RuntimeContext, locale: Locale, format: NumberFormat): void {
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context._numberFormatters.has(id)) {
      continue
    }
    context._numberFormatters.delete(id)
  }
}
