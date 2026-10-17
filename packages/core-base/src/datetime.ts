import { create, isDate, isNumber, isString } from '@intlify/shared'
import { MISSING_RESOLVE_VALUE } from './context'
import { CoreErrorCodes, createCoreError } from './errors'
import { clearFormatCache, formatValue, parseFormatArgs } from './formatter'
import { Availabilities } from './intl'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { CoreContext, CoreInternalContext } from './context'
import type { LocaleOptions } from './fallbacker'
import type { Locale } from './runtime'
import type { DateTimeFormat, DateTimeFormatOptions, PickupFormatKeys } from './types/index'
import type { FormatResources } from './formatter'

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
 *    datetime(cnotext, value, 'short', { year: '2-digit' })
 *    datetime(cnotext, value, 'short', 'ja-JP', { year: '2-digit' })
 *    datetime(context, value, { key: 'short', part: true, year: '2-digit' })
 */

/**
 * DateTime options
 *
 * @remarks
 * Options for Datetime formatting API
 *
 * @VueI18nGeneral
 */
export interface DateTimeOptions<Key = string, Locales = Locale>
  extends Intl.DateTimeFormatOptions, LocaleOptions<Locales> {
  /**
   * @remarks
   * The target format key
   */
  key?: Key
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
   * Whether to use [Intel.DateTimeFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)
   */
  part?: boolean
}

/**
 * `datetime` function overloads
 */

export function datetime<Context extends CoreContext<Message, {}, {}, {}>, Message = string>(
  context: Context,
  value: number | string | Date
): string | number | Intl.DateTimeFormatPart[]

export function datetime<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number | string | Date = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['datetimeFormats']> = PickupFormatKeys<
    Context['datetimeFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Context['locale']>
): string | number | Intl.DateTimeFormatPart[]

export function datetime<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number | string | Date = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['datetimeFormats']> = PickupFormatKeys<
    Context['datetimeFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Context['locale']>,
  locale: Context['locale']
): string | number | Intl.DateTimeFormatPart[]

export function datetime<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number | string | Date = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['datetimeFormats']> = PickupFormatKeys<
    Context['datetimeFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Context['locale']>,
  override: Intl.DateTimeFormatOptions
): string | number | Intl.DateTimeFormatPart[]

export function datetime<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number | string | Date = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['datetimeFormats']> = PickupFormatKeys<
    Context['datetimeFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | DateTimeOptions<Key | ResourceKeys, Context['locale']>,
  locale: Context['locale'],
  override: Intl.DateTimeFormatOptions
): string | number | Intl.DateTimeFormatPart[]

// implementation of `datetime` function
export function datetime<Context extends CoreContext<Message, {}, {}, {}>, Message = string>(
  context: Context,
  ...args: unknown[]
): string | number | Intl.DateTimeFormatPart[] {
  const { datetimeFormats, onWarn } = context
  const { __datetimeFormatters } = context as unknown as CoreInternalContext

  if (__DEV__ && !Availabilities.dateTimeFormat) {
    onWarn(getWarnMessage(CoreWarnCodes.CANNOT_FORMAT_DATE))
    return MISSING_RESOLVE_VALUE
  }

  if (!isString(args[0]) && !isDate(args[0]) && !isNumber(args[0])) {
    if (__DEV__) {
      onWarn(getWarnMessage(CoreWarnCodes.INVALID_DATE_ARGUMENT, { value: String(args[0]) }))
    }
    return MISSING_RESOLVE_VALUE
  }

  return formatValue(
    context,
    parseDateTimeArgs(...args),
    Intl.DateTimeFormat,
    __datetimeFormatters,
    datetimeFormats as unknown as FormatResources<DateTimeFormatOptions>,
    'datetime format'
  )
}

/** @internal */
export const DATETIME_FORMAT_OPTIONS_KEYS: string[] = [
  'localeMatcher',
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'timeZoneName',
  'formatMatcher',
  'hour12',
  'timeZone',
  'dateStyle',
  'timeStyle',
  'calendar',
  'dayPeriod',
  'numberingSystem',
  'hourCycle',
  'fractionalSecondDigits'
]

/** @internal */
export function parseDateTimeArgs(
  ...args: unknown[]
): [string, number | Date, DateTimeOptions, Intl.DateTimeFormatOptions] {
  const [arg1] = args
  const options = create() as DateTimeOptions
  const initialOverrides = create() as Intl.DateTimeFormatOptions

  let value: number | Date
  if (isString(arg1)) {
    // Only allow ISO strings - other date formats are often supported,
    // but may cause different results in different browsers.
    const matches = arg1.match(/^(\d{4}-\d{2}-\d{2})(?:(T|\s)(.+))?$/) // eslint-disable-line regexp/no-unused-capturing-group -- FIXME:
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT)
    }
    // Some browsers can not parse the iso datetime separated by space,
    // this is a compromise solution by replace the 'T'/' ' with 'T'
    const dateTime = matches[3]
      ? matches[3].trim().startsWith('T')
        ? `${matches[1].trim()}${matches[3].trim()}`
        : `${matches[1].trim()}T${matches[3].trim()}`
      : matches[1].trim()
    value = new Date(dateTime)

    try {
      // This will fail if the date is not valid
      value.toISOString()
    } catch {
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

  const overrides = parseFormatArgs<DateTimeOptions, Intl.DateTimeFormatOptions>(
    args,
    options,
    initialOverrides,
    DATETIME_FORMAT_OPTIONS_KEYS
  )

  return [options.key || '', value, options, overrides]
}

/** @internal */
export function clearDateTimeFormat<DateTimeFormats = {}, Message = string>(
  ctx: CoreContext<Message, {}, DateTimeFormats>,
  locale: Locale,
  format: DateTimeFormat
): void {
  const context = ctx as unknown as CoreInternalContext
  clearFormatCache(context.__datetimeFormatters, locale, format)
}
