import {
  getOwn,
  isKeylessObject,
  isPlainObject,
  isString,
  toDevtoolsGroupId
} from '@intlify/shared'
import { DEFAULT_LOCALE, handleMissing, isTranslateFallbackWarn } from './context'
import { CoreWarnCodes, getWarnMessage } from './warnings'

import type { CoreContext, CoreInternalContext } from './context'
import type { CoreMissingType, FallbackLocale, Locale } from './runtime'

type FormatType = Extract<CoreMissingType, 'datetime format' | 'number format'>

export type FormatResources<Format> = Record<string, Record<string, Format>>

export function resolveFormatLocale<Format, Message = string>(
  context: CoreContext<Message>,
  key: string,
  locale: Locale,
  formats: FormatResources<Format>,
  missingWarn: boolean | RegExp,
  fallbackWarn: boolean | RegExp,
  type: FormatType
): Locale | null {
  const { fallbackLocale, localeFallbacker, onWarn } = context
  const locales = localeFallbacker(context as any, fallbackLocale as FallbackLocale, locale)
  let from = locale

  for (let i = 0; i < locales.length; i++) {
    const targetLocale = locales[i]
    if (__DEV__ && locale !== targetLocale && isTranslateFallbackWarn(fallbackWarn, key)) {
      onWarn(
        getWarnMessage(
          type === 'datetime format'
            ? CoreWarnCodes.FALLBACK_TO_DATE_FORMAT
            : CoreWarnCodes.FALLBACK_TO_NUMBER_FORMAT,
          {
            key,
            target: targetLocale
          }
        )
      )
    }

    if (__DEV__ && locale !== targetLocale) {
      const emitter = (context as unknown as CoreInternalContext).__v_emitter
      if (emitter) {
        emitter.emit('fallback', {
          type,
          key,
          from,
          to: targetLocale,
          groupId: toDevtoolsGroupId(type, key)
        })
      }
    }

    // read only own properties, so that a locale such as `constructor` does not read a built-in object
    const format = getOwn(getOwn(formats, targetLocale) || {}, key)
    if (isPlainObject(format) && isString(targetLocale)) {
      return targetLocale
    }

    handleMissing(context, key, targetLocale, missingWarn, type)
    from = targetLocale
  }

  return null
}

function isLanguageTag(locale: Locale): boolean {
  try {
    Intl.getCanonicalLocales(locale)
    return true
  } catch {
    return false
  }
}

/**
 * Create an `Intl.DateTimeFormat` or `Intl.NumberFormat` formatter
 *
 * @remarks
 * `Intl` throws a RangeError for a locale that is not a BCP 47 language tag (e.g. `pt_BR`),
 * so fall back to the first language tag in the locale chain, or the default locale
 */
export function createFormatter<Formatter, Options>(
  context: CoreContext<any>,
  IntlFormatter: new (locale: Locale, options?: Options) => Formatter,
  locale: Locale,
  options: Options,
  type: 'datetime' | 'number'
): Formatter {
  try {
    return new IntlFormatter(locale, options)
  } catch (error) {
    // an error of the options, such as an invalid time zone
    if (isLanguageTag(locale)) {
      throw error
    }
    const { fallbackLocale, localeFallbacker, onWarn } = context
    const target =
      localeFallbacker(context as any, fallbackLocale as FallbackLocale, locale).find(
        isLanguageTag
      ) || DEFAULT_LOCALE
    if (__DEV__) {
      onWarn(getWarnMessage(CoreWarnCodes.FALLBACK_FROM_INVALID_LOCALE, { locale, target, type }))
    }
    return new IntlFormatter(target, options)
  }
}

export function getFormatterCacheKey(locale: Locale, key: string, overrides: unknown): string {
  let id = `${locale}__${key}`
  if (isPlainObject(overrides) && !isKeylessObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`
  }
  return id
}

export function clearFormatCache<Formatter>(
  formatters: Map<string, Formatter>,
  locale: Locale,
  format: Record<string, unknown>
): void {
  for (const key in format) {
    const prefix = `${locale}__${key}`
    for (const id of formatters.keys()) {
      if (id === prefix || id.startsWith(`${prefix}__`)) {
        formatters.delete(id)
      }
    }
  }
}

export function parseFormatArgs<Options extends { key?: string }, Overrides>(
  args: unknown[],
  options: Options,
  initialOverrides: Overrides,
  optionsKeys: readonly string[]
): Overrides {
  const [, arg2, arg3, arg4] = args
  let overrides = initialOverrides

  if (isString(arg2)) {
    options.key = arg2
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach(key => {
      if (optionsKeys.includes(key)) {
        ;(overrides as any)[key] = (arg2 as any)[key]
      } else {
        ;(options as any)[key] = (arg2 as any)[key]
      }
    })
  }

  if (isString(arg3)) {
    ;(options as any).locale = arg3
  } else if (isPlainObject(arg3)) {
    overrides = arg3 as Overrides
  }

  if (isPlainObject(arg4)) {
    overrides = arg4 as Overrides
  }

  return overrides
}
