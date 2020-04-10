import { Availabilities, DateTimeFormat, DateTimeFormatOptions } from './types'
import {
  RuntimeContext,
  Locale,
  getLocaleChain,
  handleMissing,
  isTrarnslateFallbackWarn,
  NOT_REOSLVED,
  MISSING_RESOLVE_VALUE
} from './context'
import {
  warn,
  isString,
  isBoolean,
  isPlainObject,
  isDate,
  isNumber
} from '../utils'

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
 *    // suppress localize miss warning option, override context.missingWarn
 *    datetime(context, value, { key: 'short', locale: 'ja-JP', missingWarn: false })
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    datetime(context, value, { key: 'short', locale: 'ja-JP', fallbackWarn: false })
 */

export type DateTimeOptions = {
  key?: string
  locale?: Locale
  missingWarn?: boolean
  fallbackWarn?: boolean
}

// `datetime` function overloads
export function datetime(
  context: RuntimeContext,
  value: number | Date
): string | number
export function datetime(
  context: RuntimeContext,
  value: number | Date,
  key: string
): string | number
export function datetime(
  context: RuntimeContext,
  value: number | Date,
  key: string,
  locale: Locale
): string | number
export function datetime(
  context: RuntimeContext,
  value: number | Date,
  options: DateTimeOptions
): string | number
export function datetime(
  context: RuntimeContext,
  ...args: unknown[]
): string | number // for internal

// implementation of `datetime` function
export function datetime(
  context: RuntimeContext,
  ...args: unknown[]
): string | number {
  const {
    datetimeFormats,
    unresolving,
    fallbackLocale,
    _datetimeFormatters
  } = context

  if (__DEV__ && !Availabilities.dateTimeFormat) {
    warn(`Cannot format a Date value due to not supported Intl.DateTimeFormat.`)
    return MISSING_RESOLVE_VALUE
  }

  const [value, options] = parseDateTimeArgs(...args)
  const { key } = options
  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn
  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn
  const locale = isString(options.locale) ? options.locale : context.locale
  const locales = getLocaleChain(context, fallbackLocale, locale)

  if (!isString(key)) {
    return new Intl.DateTimeFormat(locale).format(value)
  }

  // resolve format
  let datetimeFormat: DateTimeFormat = {}
  let targetLocale: Locale | undefined
  let format: DateTimeFormatOptions | null = null
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i]
    if (
      __DEV__ &&
      locale !== targetLocale &&
      isTrarnslateFallbackWarn(fallbackWarn, key)
    ) {
      warn(
        `Fall back to datetime format '${key}' key with '${targetLocale}' locale.`
      )
    }
    datetimeFormat = datetimeFormats[targetLocale] || {}
    format = datetimeFormat[key]
    if (isPlainObject(format)) break
    handleMissing(context, key, targetLocale, missingWarn, 'datetime')
  }

  // checking format and target locale
  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key
  }

  const id = `${targetLocale}__${key}`
  let formatter = _datetimeFormatters.get(id)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, format)
    _datetimeFormatters.set(id, formatter)
  }
  return formatter.format(value)
}

export function parseDateTimeArgs(
  ...args: unknown[]
): [number | Date, DateTimeOptions] {
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

export function clearDateTimeFormat(
  context: RuntimeContext,
  locale: Locale,
  format: DateTimeFormat
): void {
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context._datetimeFormatters.has(id)) {
      continue
    }
    context._datetimeFormatters.delete(id)
  }
}
