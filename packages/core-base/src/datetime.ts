import {
  isString,
  isBoolean,
  isPlainObject,
  isDate,
  isNumber,
  isEmptyObject
} from '@intlify/shared'
import {
  getLocaleChain,
  handleMissing,
  isTranslateFallbackWarn,
  NOT_REOSLVED,
  MISSING_RESOLVE_VALUE
} from './context'
import { CoreWarnCodes, getWarnMessage } from './warnings'
import { CoreErrorCodes, createCoreError } from './errors'
import { DevToolsTimelineEvents } from './debugger/constants'
import { Availabilities } from './intl'

import type {
  DateTimeFormat,
  DateTimeFormats as DateTimeFormatsType,
  DateTimeFormatOptions
} from './types'
import type {
  Locale,
  CoreDateTimeContext,
  CoreInternalContext
} from './context'

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

/**
 * DateTime options
 *
 * @remarks
 * Options for Datetime formatting API
 *
 * @VueI18nGeneral
 */
export interface DateTimeOptions {
  /**
   * @remarks
   * The target format key
   */
  key?: string
  /**
   * @remarks
   * The locale of localization
   */
  locale?: Locale
  /**
   * @remarks
   * Whether suppress warnings outputted when localization fails
   */
  missingWarn?: boolean
  /**
   * @remarks
   * Whether do resolve on format keys when your language lacks a formatting for a key
   */
  fallbackWarn?: boolean
  /**
   * @remarks
   * Whether to use [Intel.DateTimeForrmat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)
   */
  part?: boolean
}

// `datetime` function overloads
export function datetime<DateTimeFormats, Message = string>(
  context: CoreDateTimeContext<DateTimeFormats, Message>,
  value: number | Date
): string | number | Intl.DateTimeFormatPart[]
export function datetime<DateTimeFormats, Message = string>(
  context: CoreDateTimeContext<DateTimeFormats, Message>,
  value: number | Date,
  key: string
): string | number | Intl.DateTimeFormatPart[]
export function datetime<DateTimeFormats, Message = string>(
  context: CoreDateTimeContext<DateTimeFormats, Message>,
  value: number | Date,
  key: string,
  locale: Locale
): string | number | Intl.DateTimeFormatPart[]
export function datetime<DateTimeFormats, Message = string>(
  context: CoreDateTimeContext<DateTimeFormats, Message>,
  value: number | Date,
  options: DateTimeOptions
): string | number | Intl.DateTimeFormatPart[]
export function datetime<DateTimeFormats, Message = string>(
  context: CoreDateTimeContext<DateTimeFormats, Message>,
  ...args: unknown[]
): string | number | Intl.DateTimeFormatPart[] // for internal

// implementation of `datetime` function
export function datetime<DateTimeFormats, Message = string>(
  context: CoreDateTimeContext<DateTimeFormats, Message>,
  ...args: unknown[]
): string | number | Intl.DateTimeFormatPart[] {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn } = context
  const { __datetimeFormatters } = (context as unknown) as CoreInternalContext

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
  let from: Locale = locale
  let to: Locale | null = null
  const type = 'datetime format'

  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i]
    if (
      __DEV__ &&
      locale !== targetLocale &&
      isTranslateFallbackWarn(fallbackWarn, key)
    ) {
      onWarn(
        getWarnMessage(CoreWarnCodes.FALLBACK_TO_DATE_FORMAT, {
          key,
          target: targetLocale
        })
      )
    }

    // for vue-devtools timeline event
    if (__DEV__ && locale !== targetLocale) {
      const emitter = ((context as unknown) as CoreInternalContext).__emitter
      if (emitter) {
        emitter.emit(DevToolsTimelineEvents.FALBACK, {
          type,
          key,
          from,
          to
        })
      }
    }

    datetimeFormat =
      ((datetimeFormats as unknown) as DateTimeFormatsType)[targetLocale] || {}
    format = datetimeFormat[key]

    if (isPlainObject(format)) break
    handleMissing(context, key, targetLocale, missingWarn, type)
    from = to
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

  let value: number | Date
  if (isString(arg1)) {
    // Only allow ISO strings - other date formats are often supported,
    // but may cause different results in different browsers.
    if (!/\d{4}-\d{2}-\d{2}(T.*)?/.test(arg1)) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT)
    }
    value = new Date(arg1)

    try {
      // This will fail if the date is not valid
      value.toISOString()
    } catch (e) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT)
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT)
    }
    value = arg1
  } else if (isNumber(arg1)) {
    value = arg1
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
  }

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
  ctx: CoreDateTimeContext<DateTimeFormats, Message>,
  locale: Locale,
  format: DateTimeFormat
): void {
  const context = (ctx as unknown) as CoreInternalContext
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context.__datetimeFormatters.has(id)) {
      continue
    }
    context.__datetimeFormatters.delete(id)
  }
}
