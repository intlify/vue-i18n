import {
  isArray,
  isBoolean,
  isFunction,
  isObject,
  isPlainObject,
  isPromise,
  isString
} from '@intlify/shared'
import { DEFAULT_LOCALE } from './context'
import { CoreErrorCodes, createCoreError } from './errors'

import type { CoreContext, CoreInternalContext } from './context'
import type { FallbackLocale, Locale, LocaleDetector } from './runtime'

/** @VueI18nGeneral */
export interface LocaleOptions<Locales = Locale> {
  /**
   * @remarks
   * The locale of localization
   */
  locale?: Locales | LocaleDetector
}

/** @internal */
export function getLocale<Messages, Message>(
  context: CoreContext<Message, Messages>,
  options: LocaleOptions
): string {
  return options.locale != null
    ? resolveLocale(options.locale)
    : resolveLocale(context.locale)
}

let _resolveLocale: string

/** @internal */
export function resolveLocale(locale: Locale | LocaleDetector): string {
  if (isString(locale)) {
    return locale
  } else {
    if (isFunction(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale
      } else if (locale.constructor.name === 'Function') {
        const resolve = locale()
        if (isPromise(resolve)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE)
        }
        return (_resolveLocale = resolve)
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION)
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE)
    }
  }
}

/**
 * The locale fallbacker
 *
 * @VueI18nGeneral
 */
export type LocaleFallbacker = <Message = string>(
  ctx: CoreContext<Message>,
  fallback: FallbackLocale,
  start: Locale
) => Locale[]

/**
 * Fallback with simple implemenation
 *
 * @remarks
 * A fallback locale function implemented with a simple fallback algorithm.
 *
 * Basically, it returns the value as specified in the `fallbackLocale` props, and is processed with the fallback inside intlify.
 *
 * @param ctx - A {@link CoreContext | context}
 * @param fallback - A {@link FallbackLocale | fallback locale}
 * @param start - A starting {@link Locale | locale}
 *
 * @returns Fallback locales
 *
 * @VueI18nGeneral
 */
export function fallbackWithSimple<Message = string>(
  ctx: CoreContext<Message>,
  fallback: FallbackLocale,
  start: Locale
): Locale[] {
  // prettier-ignore
  return [...new Set(
    [
      start,
      ...(isArray(fallback)
        ? fallback
        : isObject(fallback)
          ? Object.keys(fallback)
          : isString(fallback)
            ? [fallback]
            : [start])
    ]
  )]
}

/**
 * Fallback with locale chain
 *
 * @remarks
 * A fallback locale function implemented with a fallback chain algorithm. It's used in VueI18n as default.
 *
 * @param ctx - A {@link CoreContext | context}
 * @param fallback - A {@link FallbackLocale | fallback locale}
 * @param start - A starting {@link Locale | locale}
 *
 * @returns Fallback locales
 *
 * @VueI18nSee [Fallbacking](../../guide/essentials/fallback)
 *
 * @VueI18nGeneral
 */
export function fallbackWithLocaleChain<Message = string>(
  ctx: CoreContext<Message>,
  fallback: FallbackLocale,
  start: Locale
): Locale[] {
  const startLocale = isString(start) ? start : DEFAULT_LOCALE
  const context = ctx as unknown as CoreInternalContext

  if (!context.__localeChainCache) {
    context.__localeChainCache = new Map()
  }

  let chain = context.__localeChainCache.get(startLocale)
  if (!chain) {
    chain = []

    // first block defined by start
    let block: unknown = [start]

    // while any intervening block found
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback)
    }

    // prettier-ignore
    // last block defined by default
    const defaults = isArray(fallback) || !isPlainObject(fallback)
      ? fallback
      : fallback['default']
        ? fallback['default']
        : null

    // convert defaults to array
    block = isString(defaults) ? [defaults] : defaults
    if (isArray(block)) {
      appendBlockToChain(chain, block, false)
    }
    context.__localeChainCache.set(startLocale, chain)
  }

  return chain
}

function appendBlockToChain(
  chain: Locale[],
  block: Locale[],
  blocks: FallbackLocale
): unknown {
  let follow: unknown = true
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i]
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks)
    }
  }
  return follow
}

function appendLocaleToChain(
  chain: Locale[],
  locale: Locale,
  blocks: FallbackLocale
): unknown {
  let follow: unknown
  const tokens = locale.split('-')
  do {
    const target = tokens.join('-')
    follow = appendItemToChain(chain, target, blocks)
    tokens.splice(-1, 1)
  } while (tokens.length && follow === true)
  return follow
}

function appendItemToChain(
  chain: Locale[],
  target: Locale,
  blocks: FallbackLocale
): unknown {
  let follow: unknown = false
  if (!chain.includes(target)) {
    follow = true
    if (target) {
      follow = target[target.length - 1] !== '!'
      const locale = target.replace(/!/g, '')
      chain.push(locale)
      if (
        (isArray(blocks) || isPlainObject(blocks)) &&
        (blocks as any)[locale] // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        follow = (blocks as any)[locale]
      }
    }
  }
  return follow
}
