import { assign, create, isBoolean, isNumber, isString } from '@intlify/shared'
import { MISSING_RESOLVE_VALUE, NOT_RESOLVED } from './context'
import { CoreErrorCodes, createCoreError } from './errors'
import { getLocale } from './fallbacker'
import {
  clearFormatCache,
  getFormatterCacheKey,
  parseFormatArgs,
  resolveFormatLocale
} from './formatter'
import { Availabilities } from './intl'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { CoreContext, CoreInternalContext } from './context'
import type { LocaleOptions } from './fallbacker'
import type { Locale } from './runtime'
import type { NumberFormat, NumberFormatOptions, PickupFormatKeys } from './types'
import type { FormatResources } from './formatter'

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
 *    // suppress localize miss warning option, override context.missingWarn
 *    number(context, value, { key: 'currency', locale: 'ja-JP', missingWarn: false })
 *
 *    // suppress localize fallback warning option, override context.fallbackWarn
 *    number(context, value, { key: 'currency', locale: 'ja-JP', fallbackWarn: false })
 *
 *    // if you specify `part` options, you can get an array of objects containing the formatted number in parts
 *    number(context, value, { key: 'currenty', part: true })
 *
 *    // orverride context.numberFormats[locale] options with functino options
 *    number(cnotext, value, 'currency', { year: '2-digit' })
 *    number(cnotext, value, 'currency', 'ja-JP', { year: '2-digit' })
 *    number(context, value, { key: 'currenty', locale: 'ja-JP', part: true, year: '2-digit'})
 */

/**
 * Number Options
 *
 * @remarks
 * Options for Number formatting API
 *
 * @VueI18nGeneral
 */
export interface NumberOptions<Key = string, Locales = Locale>
  extends Intl.NumberFormatOptions, LocaleOptions<Locales> {
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
   * Whether to use [Intel.NumberFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)
   */
  part?: boolean
}

/**
 * `number` function overloads
 */

export function number<Context extends CoreContext<Message, {}, {}, {}>, Message = string>(
  context: Context,
  value: number
): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['numberFormats']> = PickupFormatKeys<
    Context['numberFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Context['locale']>
): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['numberFormats']> = PickupFormatKeys<
    Context['numberFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Context['locale']>,
  locale: Context['locale']
): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['numberFormats']> = PickupFormatKeys<
    Context['numberFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Context['locale']>,
  override: Intl.NumberFormatOptions
): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<Context['numberFormats']> = PickupFormatKeys<
    Context['numberFormats']
  >,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions: Key | ResourceKeys | NumberOptions<Key | ResourceKeys, Context['locale']>,
  locale: Context['locale'],
  override: Intl.NumberFormatOptions
): string | number | Intl.NumberFormatPart[]

// implementation of `number` function
export function number<Context extends CoreContext<Message, {}, {}, {}>, Message = string>(
  context: Context,
  ...args: unknown[]
): string | number | Intl.NumberFormatPart[] {
  const { numberFormats, unresolving, onWarn } = context
  const { __numberFormatters } = context as unknown as CoreInternalContext

  if (__DEV__ && !Availabilities.numberFormat) {
    onWarn(getWarnMessage(CoreWarnCodes.CANNOT_FORMAT_NUMBER))
    return MISSING_RESOLVE_VALUE
  }

  if (!isNumber(args[0])) {
    if (__DEV__) {
      onWarn(getWarnMessage(CoreWarnCodes.INVALID_NUMBER_ARGUMENT, { value: String(args[0]) }))
    }
    return MISSING_RESOLVE_VALUE
  }

  const [key, value, options, overrides] = parseNumberArgs(...args)
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn
  const part = !!options.part
  const locale = getLocale(context, options)

  if (!isString(key) || key === '') {
    const formatter = new Intl.NumberFormat(locale.replace(/!/g, ''), overrides)
    return !part ? formatter.format(value) : formatter.formatToParts(value)
  }

  const targetLocale = resolveFormatLocale(
    context,
    key,
    locale,
    numberFormats as unknown as FormatResources<NumberFormatOptions>,
    missingWarn,
    fallbackWarn,
    'number format'
  )
  if (!isString(targetLocale)) {
    return unresolving ? NOT_RESOLVED : key
  }
  const format = (numberFormats as unknown as FormatResources<NumberFormatOptions>)[targetLocale][
    key
  ]

  const id = getFormatterCacheKey(targetLocale, key, overrides)
  let formatter = __numberFormatters.get(id)
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format, overrides))
    __numberFormatters.set(id, formatter)
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value)
}

/** @internal */
export const NUMBER_FORMAT_OPTIONS_KEYS: string[] = [
  'localeMatcher',
  'style',
  'currency',
  'currencyDisplay',
  'currencySign',
  'useGrouping',
  'minimumIntegerDigits',
  'minimumFractionDigits',
  'maximumFractionDigits',
  'minimumSignificantDigits',
  'maximumSignificantDigits',
  'compactDisplay',
  'notation',
  'signDisplay',
  'unit',
  'unitDisplay',
  'roundingMode',
  'roundingPriority',
  'roundingIncrement',
  'trailingZeroDisplay'
]

/** @internal */
export function parseNumberArgs(
  ...args: unknown[]
): [string, number, NumberOptions, Intl.NumberFormatOptions] {
  const [arg1] = args
  const options = create() as NumberOptions
  const initialOverrides = create() as Intl.NumberFormatOptions

  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
  }
  const value = arg1

  const overrides = parseFormatArgs<NumberOptions, Intl.NumberFormatOptions>(
    args,
    options,
    initialOverrides,
    NUMBER_FORMAT_OPTIONS_KEYS
  )

  return [options.key || '', value, options, overrides]
}

/** @internal */
export function clearNumberFormat<NumberFormats, Message = string>(
  ctx: CoreContext<Message, {}, {}, NumberFormats>,
  locale: Locale,
  format: NumberFormat
): void {
  const context = ctx as unknown as CoreInternalContext
  clearFormatCache(context.__numberFormatters, locale, format)
}
