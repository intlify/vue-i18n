import { Availabilities, NumberFormat, NumberFormatOptions } from './types'
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
  isNumber,
  isEmptyObject
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
 *    number(context, value, { key: 'currenty', part: true }, { year: '2-digit'})
 */

export type NumberOptions = {
  key?: string
  locale?: Locale
  missingWarn?: boolean
  fallbackWarn?: boolean
  part?: boolean
}

// `number` function overloads
export function number(
  context: RuntimeContext,
  value: number
): string | number | Intl.NumberFormatPart[]
export function number(
  context: RuntimeContext,
  value: number,
  key: string
): string | number | Intl.NumberFormatPart[]
export function number(
  context: RuntimeContext,
  value: number,
  key: string,
  locale: Locale
): string | number | Intl.NumberFormatPart[]
export function number(
  context: RuntimeContext,
  value: number,
  options: NumberOptions
): string | number | Intl.NumberFormatPart[]
export function number(
  context: RuntimeContext,
  ...args: unknown[]
): string | number | Intl.NumberFormatPart[] // for internal

// implementation of `number` function
export function number(
  context: RuntimeContext,
  ...args: unknown[]
): string | number | Intl.NumberFormatPart[] {
  const {
    numberFormats,
    unresolving,
    fallbackLocale,
    _numberFormatters
  } = context

  if (__DEV__ && !Availabilities.numberFormat) {
    warn(`Cannot format a Date value due to not supported Intl.NumberFormat.`)
    return MISSING_RESOLVE_VALUE
  }

  const [key, value, options, orverrides] = parseNumberArgs(...args)
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
    return new Intl.NumberFormat(locale).format(value)
  }

  // resolve format
  let numberFormat: NumberFormat = {}
  let targetLocale: Locale | undefined
  let format: NumberFormatOptions | null = null
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i]
    if (
      __DEV__ &&
      locale !== targetLocale &&
      isTrarnslateFallbackWarn(fallbackWarn, key)
    ) {
      warn(
        `Fall back to number format '${key}' key with '${targetLocale}' locale.`
      )
    }
    numberFormat = numberFormats[targetLocale] || {}
    format = numberFormat[key]
    if (isPlainObject(format)) break
    handleMissing(context, key, targetLocale, missingWarn, 'number')
  }

  // checking format and target locale
  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key
  }

  let id = `${targetLocale}__${key}`
  if (!isEmptyObject(orverrides)) {
    id = `${id}__${JSON.stringify(orverrides)}`
  }

  let formatter = _numberFormatters.get(id)
  if (!formatter) {
    formatter = new Intl.NumberFormat(
      targetLocale,
      Object.assign({}, format, orverrides)
    )
    _numberFormatters.set(id, formatter)
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value)
}

export function parseNumberArgs(
  ...args: unknown[]
): [string, number, NumberOptions, Intl.NumberFormatOptions] {
  const [arg1, arg2, arg3, arg4] = args
  let options = {} as NumberOptions
  let orverrides = {} as Intl.NumberFormatOptions

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
  } else if (isPlainObject(arg3)) {
    orverrides = arg3
  }

  if (isPlainObject(arg4)) {
    orverrides = arg4
  }

  return [options.key || '', value, options, orverrides]
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
