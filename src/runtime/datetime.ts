import { Availabilities, DateTimeFormat } from './types'
import {
  RuntimeContext,
  Locale,
  fallback,
  MISSING_RESOLVE_VALUE
} from './context'
import { warn, isString, isArray, isBoolean, isPlainObject, isDate, isNumber } from '../utils'

/**
 *  # datetime
 *
 *  ## usages:
 *    // for example `context.datetimeFormats` below
 *    'en-US': {
 *      short: {
 *        year: 'numeric', month: '2-digit', day: '2-digit',
 *        hour: '2-digit', minute: '2-digit'
 *      }
 *    },
 *    'ja-JP': { ... }
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
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    datetime(context, value, { key: 'short', locale: 'ja-JP', fallbackWarn: false })
 */

export type DateTimeOptions = {
  key?: string
  locale?: Locale,
  fallbackWarn?: boolean
}

// `datetime` function overloads
export function datetime (context: RuntimeContext, value: number | Date): string | number
export function datetime (context: RuntimeContext, value: number | Date, key: string): string | number
export function datetime (context: RuntimeContext, value: number | Date, key: string, locale: Locale): string | number
export function datetime (context: RuntimeContext, value: number | Date, options: DateTimeOptions): string | number

// implementationo of `datetime` function
export function datetime (
  context: RuntimeContext,
  ...args: unknown[]
): string | number {
  const { datetimeFormats, _datetimeFormatters, _fallbackLocaleStack } = context

  if (__DEV__ && !Availabilities.dateTimeFormat) {
    warn(`Cannot format a Date value due to not supported Intl.DateTimeFormat.`)
    return MISSING_RESOLVE_VALUE
  }

  const [value, options] = parseDateTimeArgs(...args)
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
    return new Intl.DateTimeFormat(locale).format(value)
  }

  const datetimeFormat = datetimeFormats[locale]
  if (!datetimeFormat) {
    return fallback(
      context,
      key,
      fallbackWarn, 'datetime format',
      (context: RuntimeContext): string | number => datetime(context, value, options)
    )
  }

  const format = datetimeFormat[key]
  if (!format) {
    return fallback(
      context,
      key,
      fallbackWarn, 'datetime format',
      (context: RuntimeContext): string | number => datetime(context, value, options)
    )
  }

  const id = `${locale}__${key}`
  let formatter = _datetimeFormatters.get(id)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, format)
    _datetimeFormatters.set(id, formatter)
  }
  return formatter.format(value)
}

export function parseDateTimeArgs (...args: unknown[]): [number | Date, DateTimeOptions] {
  const [arg1, arg2, arg3] = args
  let options = {} as DateTimeOptions

  if (!(isNumber(arg1) || isDate(arg1))) {
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

export function clearDateTimeFormat (context: RuntimeContext, locale: Locale, format: DateTimeFormat): void {
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context._datetimeFormatters.has(id)) {
      continue
    }
    context._datetimeFormatters.delete(id)
  }
}
