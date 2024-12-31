import {
  assign,
  create,
  isBoolean,
  isEmptyObject,
  isNumber,
  isPlainObject,
  isString
} from '@intlify/shared'
import {
  handleMissing,
  isTranslateFallbackWarn,
  MISSING_RESOLVE_VALUE,
  NOT_REOSLVED
} from './context'
import { CoreErrorCodes, createCoreError } from './errors'
import { getLocale } from './fallbacker'
import { Availabilities } from './intl'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { CoreContext, CoreInternalContext } from './context'
import type { LocaleOptions } from './fallbacker'
import type { FallbackLocale, Locale } from './runtime'
import type {
  NumberFormat,
  NumberFormatOptions,
  NumberFormats as NumberFormatsType,
  PickupFormatKeys
} from './types'

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
  extends Intl.NumberFormatOptions,
    LocaleOptions<Locales> {
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

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Message = string
>(context: Context, value: number): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<
    Context['numberFormats']
  > = PickupFormatKeys<Context['numberFormats']>,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions:
    | Key
    | ResourceKeys
    | NumberOptions<Key | ResourceKeys, Context['locale']>
): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<
    Context['numberFormats']
  > = PickupFormatKeys<Context['numberFormats']>,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions:
    | Key
    | ResourceKeys
    | NumberOptions<Key | ResourceKeys, Context['locale']>,
  locale: Context['locale']
): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<
    Context['numberFormats']
  > = PickupFormatKeys<Context['numberFormats']>,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions:
    | Key
    | ResourceKeys
    | NumberOptions<Key | ResourceKeys, Context['locale']>,
  override: Intl.NumberFormatOptions
): string | number | Intl.NumberFormatPart[]

export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Value extends number = number,
  Key extends string = string,
  ResourceKeys extends PickupFormatKeys<
    Context['numberFormats']
  > = PickupFormatKeys<Context['numberFormats']>,
  Message = string
>(
  context: Context,
  value: Value,
  keyOrOptions:
    | Key
    | ResourceKeys
    | NumberOptions<Key | ResourceKeys, Context['locale']>,
  locale: Context['locale'],
  override: Intl.NumberFormatOptions
): string | number | Intl.NumberFormatPart[]

// implementation of `number` function
export function number<
  Context extends CoreContext<Message, {}, {}, {}>,
  Message = string
>(
  context: Context,
  ...args: unknown[]
): string | number | Intl.NumberFormatPart[] {
  const {
    numberFormats,
    unresolving,
    fallbackLocale,
    onWarn,
    localeFallbacker
  } = context
  const { __numberFormatters } = context as unknown as CoreInternalContext

  if (__DEV__ && !Availabilities.numberFormat) {
    onWarn(getWarnMessage(CoreWarnCodes.CANNOT_FORMAT_NUMBER))
    return MISSING_RESOLVE_VALUE
  }

  const [key, value, options, overrides] = parseNumberArgs(...args)
  const missingWarn = isBoolean(options.missingWarn)
    ? options.missingWarn
    : context.missingWarn
  const fallbackWarn = isBoolean(options.fallbackWarn)
    ? options.fallbackWarn
    : context.fallbackWarn
  const part = !!options.part
  const locale = getLocale(context, options)
  const locales = localeFallbacker(
    context as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale as FallbackLocale,
    locale
  )

  if (!isString(key) || key === '') {
    return new Intl.NumberFormat(locale, overrides).format(value)
  }

  // resolve format
  let numberFormat: NumberFormat = {}
  let targetLocale: Locale | undefined
  let format: NumberFormatOptions | null = null
  let from: Locale = locale
  let to: Locale | null = null
  const type = 'number format'

  for (let i = 0; i < locales.length; i++) {
    targetLocale = to = locales[i]
    if (
      __DEV__ &&
      locale !== targetLocale &&
      isTranslateFallbackWarn(fallbackWarn, key)
    ) {
      onWarn(
        getWarnMessage(CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT, {
          key,
          target: targetLocale
        })
      )
    }

    // for vue-devtools timeline event
    if (__DEV__ && locale !== targetLocale) {
      const emitter = (context as unknown as CoreInternalContext).__v_emitter
      if (emitter) {
        emitter.emit('fallback', {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        })
      }
    }

    numberFormat =
      (numberFormats as unknown as NumberFormatsType)[targetLocale] || {}

    format = numberFormat[key]
    if (isPlainObject(format)) break
    handleMissing(context as any, key, targetLocale, missingWarn, type) // eslint-disable-line @typescript-eslint/no-explicit-any
    from = to
  }

  // checking format and target locale
  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key
  }

  let id = `${targetLocale}__${key}`
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`
  }

  let formatter = __numberFormatters.get(id)
  if (!formatter) {
    formatter = new Intl.NumberFormat(
      targetLocale,
      assign({}, format, overrides)
    )
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
  const [arg1, arg2, arg3, arg4] = args
  const options = create() as NumberOptions
  let overrides = create() as Intl.NumberFormatOptions

  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT)
  }
  const value = arg1

  if (isString(arg2)) {
    options.key = arg2
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach(key => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(overrides as any)[key] = (arg2 as any)[key]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(options as any)[key] = (arg2 as any)[key]
      }
    })
  }

  if (isString(arg3)) {
    options.locale = arg3
  } else if (isPlainObject(arg3)) {
    overrides = arg3
  }

  if (isPlainObject(arg4)) {
    overrides = arg4
  }

  return [options.key || '', value, options, overrides]
}

/** @internal */
export function clearNumberFormat<NumberFormats, Message = string>(
  ctx: CoreContext<Message, {}, {}, NumberFormats>,
  locale: Locale,
  format: NumberFormat
): void {
  const context = ctx as unknown as CoreInternalContext
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context.__numberFormatters.has(id)) {
      continue
    }
    context.__numberFormatters.delete(id)
  }
}
