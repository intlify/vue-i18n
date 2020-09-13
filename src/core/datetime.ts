import {
  Availabilities,
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  DateTimeFormatOptions
} from './types'
import {
  RuntimeDateTimeContext,
  Locale,
  getLocaleChain,
  handleMissing,
  isTrarnslateFallbackWarn,
  NOT_REOSLVED,
  MISSING_RESOLVE_VALUE,
  RuntimeInternalContext
} from './context'
import { CoreWarnCodes, getWarnMessage } from './warnings'
import { CoreErrorCodes, createCoreError } from './errors'
import {
  isString,
  isBoolean,
  isPlainObject,
  isDate,
  isNumber,
  isEmptyObject
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
 *
 *    // if you specify `part` options, you can get an array of objects containing the formatted datetime in parts
 *    datetime(context, value, { key: 'short', part: true })
 *
 *    // orverride context.datetimeFormats[locale] options with functino options
 *    datetime(cnotext, value, 'short', { currency: 'EUR' })
 *    datetime(cnotext, value, 'short', 'ja-JP', { currency: 'EUR' })
 *    datetime(context, value, { key: 'short', part: true }, { currency: 'EUR'})
 */

/** @internal */
export type DateTimeOptions = {
  key?: string
  locale?: Locale
  missingWarn?: boolean
  fallbackWarn?: boolean
  part?: boolean
}

// `datetime` function overloads
/** @internal */
export function datetime<DateTimeFormats, Message = string>(
  context: RuntimeDateTimeContext<DateTimeFormats, Message>,
  value: number | Date
): string | number | Intl.DateTimeFormatPart[]
/** @internal */
export function datetime<DateTimeFormats, Message = string>(
  context: RuntimeDateTimeContext<DateTimeFormats, Message>,
  value: number | Date,
  key: string
): string | number | Intl.DateTimeFormatPart[]
/** @internal */
export function datetime<DateTimeFormats, Message = string>(
  context: RuntimeDateTimeContext<DateTimeFormats, Message>,
  value: number | Date,
  key: string,
  locale: Locale
): string | number | Intl.DateTimeFormatPart[]
/** @internal */
export function datetime<DateTimeFormats, Message = string>(
  context: RuntimeDateTimeContext<DateTimeFormats, Message>,
  value: number | Date,
  options: DateTimeOptions
): string | number | Intl.DateTimeFormatPart[]
/** @internal */
export function datetime<DateTimeFormats, Message = string>(
  context: RuntimeDateTimeContext<DateTimeFormats, Message>,
  ...args: unknown[]
): string | number | Intl.DateTimeFormatPart[] // for internal

// implementation of `datetime` function
/** @internal */
export function datetime<DateTimeFormats, Message = string>(
  context: RuntimeDateTimeContext<DateTimeFormats, Message>,
  ...args: unknown[]
): string | number | Intl.DateTimeFormatPart[] {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn } = context
  const {
    __datetimeFormatters
  } = (context as unknown) as RuntimeInternalContext

  if (__DEV__ && !Availabilities.dateTimeFormat) {
    onWarn(getWarnMessage(CoreWarnCodes.CANNOT_FORMAT_DATE))
    return MISSING_RESOLVE_VALUE
  }

  const [key, value, options, orverrides] = parseDateTimeArgs(...args)
  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn
  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn
  const part = !!options.part
  const locale = isString(options.locale) ? options.locale : context.locale
  const locales = getLocaleChain(context, fallbackLocale, locale)

  if (!isString(key) || key === '') {
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
      onWarn(
        getWarnMessage(CoreWarnCodes.FALLBACK_TO_DATE_FORMAT, {
          key,
          target: targetLocale
        })
      )
    }
    datetimeFormat =
      ((datetimeFormats as unknown) as DateTimeFormatsType)[targetLocale] || {}
    format = datetimeFormat[key]
    if (isPlainObject(format)) break
    handleMissing(context, key, targetLocale, missingWarn, 'datetime')
  }

  // checking format and target locale
  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key
  }

  let id = `${targetLocale}__${key}`
  if (!isEmptyObject(orverrides)) {
    id = `${id}__${JSON.stringify(orverrides)}`
  }

  let formatter = __datetimeFormatters.get(id)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(
      targetLocale,
      Object.assign({}, format, orverrides)
    )
    __datetimeFormatters.set(id, formatter)
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value)
}

/** @internal */
export function parseDateTimeArgs(
  ...args: unknown[]
): [string, number | Date, DateTimeOptions, Intl.DateTimeFormatOptions] {
  const [arg1, arg2, arg3, arg4] = args
  let options = {} as DateTimeOptions
  let orverrides = {} as Intl.DateTimeFormatOptions

  if (!(isNumber(arg1) || isDate(arg1))) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
  }
  const value = arg1

  if (isString(arg2)) {
    options.key = arg2
  } else if (isPlainObject(arg2)) {
    options = arg2
  }

  if (isString(arg3)) {
    options.locale = arg3
  } else if (isPlainObject(arg3)) {
    orverrides = arg3
  }

  if (isPlainObject(arg4)) {
    orverrides = arg4
  }

  return [options.key || '', value, options, orverrides]
}

/** @internal */
export function clearDateTimeFormat<DateTimeFormats = {}, Message = string>(
  ctx: RuntimeDateTimeContext<DateTimeFormats, Message>,
  locale: Locale,
  format: DateTimeFormat
): void {
  const context = (ctx as unknown) as RuntimeInternalContext
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context.__datetimeFormatters.has(id)) {
      continue
    }
    context.__datetimeFormatters.delete(id)
  }
}
