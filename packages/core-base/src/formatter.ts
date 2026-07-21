import { isKeylessObject, isPlainObject, isString } from '@intlify/shared'
import { handleMissing, isTranslateFallbackWarn } from './context'
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
          groupId: `${type}:${key}`
        })
      }
    }

    const format = (formats[targetLocale] || {})[key]
    if (isPlainObject(format) && isString(targetLocale)) {
      return targetLocale
    }

    handleMissing(context, key, targetLocale, missingWarn, type)
    from = targetLocale
  }

  return null
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
