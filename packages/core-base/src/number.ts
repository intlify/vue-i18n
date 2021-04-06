import {
  isString,
  isBoolean,
  isPlainObject,
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
import { DevToolsTimelineEvents } from '@intlify/vue-devtools'
import { Availabilities } from './intl'

import type { Locale } from '@intlify/runtime'
import type {
  NumberFormat,
  NumberFormats as NumberFormatsType,
  NumberFormatOptions
} from './types'
import type { CoreNumberContext, CoreInternalContext } from './context'

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

/**
 * Number Options
 *
 * @remarks
 * Options for Number formatting API
 *
 * @VueI18nGeneral
 */
export interface NumberOptions {
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
   * Whether to use [Intel.NumberFormat#formatToParts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)
   */
  part?: boolean
}

// `number` function overloads
export function number<NumberFormats, Message = string>(
  context: CoreNumberContext<NumberFormats, Message>,
  value: number
): string | number | Intl.NumberFormatPart[]
export function number<NumberFormats, Message = string>(
  context: CoreNumberContext<NumberFormats, Message>,
  value: number,
  key: string
): string | number | Intl.NumberFormatPart[]
export function number<NumberFormats, Message = string>(
  context: CoreNumberContext<NumberFormats, Message>,
  value: number,
  key: string,
  locale: Locale
): string | number | Intl.NumberFormatPart[]
export function number<NumberFormats, Message = string>(
  context: CoreNumberContext<NumberFormats, Message>,
  value: number,
  options: NumberOptions
): string | number | Intl.NumberFormatPart[]
export function number<NumberFormats, Message = string>(
  context: CoreNumberContext<NumberFormats, Message>,
  ...args: unknown[]
): string | number | Intl.NumberFormatPart[] // for internal

// implementation of `number` function
export function number<NumberFormats, Message = string>(
  context: CoreNumberContext<NumberFormats, Message>,
  ...args: unknown[]
): string | number | Intl.NumberFormatPart[] {
  const { numberFormats, unresolving, fallbackLocale, onWarn } = context
  const { __numberFormatters } = (context as unknown) as CoreInternalContext

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
  const locale = isString(options.locale) ? options.locale : context.locale
  const locales = getLocaleChain(context, fallbackLocale, locale)

  if (!isString(key) || key === '') {
    return new Intl.NumberFormat(locale).format(value)
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
      const emitter = ((context as unknown) as CoreInternalContext).__emitter
      if (emitter) {
        emitter.emit(DevToolsTimelineEvents.FALBACK, {
          type,
          key,
          from,
          to,
          groupId: `${type}:${key}`
        })
      }
    }

    numberFormat =
      ((numberFormats as unknown) as NumberFormatsType)[targetLocale] || {}

    format = numberFormat[key]
    if (isPlainObject(format)) break
    handleMissing(context, key, targetLocale, missingWarn, type)
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
      Object.assign({}, format, overrides)
    )
    __numberFormatters.set(id, formatter)
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value)
}

/** @internal */
export function parseNumberArgs(
  ...args: unknown[]
): [string, number, NumberOptions, Intl.NumberFormatOptions] {
  const [arg1, arg2, arg3, arg4] = args
  let options = {} as NumberOptions
  let overrides = {} as Intl.NumberFormatOptions

  if (!isNumber(arg1)) {
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
    overrides = arg3
  }

  if (isPlainObject(arg4)) {
    overrides = arg4
  }

  return [options.key || '', value, options, overrides]
}

/** @internal */
export function clearNumberFormat<NumberFormats, Message = string>(
  ctx: CoreNumberContext<NumberFormats, Message>,
  locale: Locale,
  format: NumberFormat
): void {
  const context = (ctx as unknown) as CoreInternalContext
  for (const key in format) {
    const id = `${locale}__${key}`
    if (!context.__numberFormatters.has(id)) {
      continue
    }
    context.__numberFormatters.delete(id)
  }
}
