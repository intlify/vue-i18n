import {
  isString,
  isArray,
  isBoolean,
  isPlainObject,
  isObject
} from '@intlify/shared'
import type { Locale, FallbackLocale } from '@intlify/runtime'
import type { CoreContext, CoreInternalContext } from './context'

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
 * @VueI18nGeneral
 */
export function fallbackWithSimple<Message = string>(
  ctx: CoreContext<Message>,
  fallback: FallbackLocale,
  start: Locale
): Locale[] {
  // prettier-ignore
  return [start].concat(
    isArray(fallback)
      ? fallback
      : isObject(fallback)
        ? Object.keys(fallback)
        : isString(fallback)
          ? [fallback]
          : ['en']
  )
}

/**
 * Fallback with locale chain
 *
 * @VueI18nGeneral
 */
export function fallbackWithLocaleChain<Message = string>(
  ctx: CoreContext<Message>,
  fallback: FallbackLocale,
  start: Locale
): Locale[] {
  const context = ctx as unknown as CoreInternalContext

  if (!context.__localeChainCache) {
    context.__localeChainCache = new Map()
  }

  let chain = context.__localeChainCache.get(start)
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
    context.__localeChainCache.set(start, chain)
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
