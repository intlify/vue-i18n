/**
 * Composition
 *
 * Composition is composable API for vue-i18n
 * This module is offered composable i18n API for Vue 3
 */

import { InjectionKey, inject, getCurrentInstance, ComponentInternalInstance, reactive } from 'vue'
import { Path } from './path'
import { LinkedModifiers } from './context'
import { Locale, LocaleMessages, createRuntimeContext, localize, RuntimeContext } from './runtime'

export const GlobalI18nSymbol: InjectionKey<I18nComposer> = Symbol.for('vue-i18n')
const providers: Map<ComponentInternalInstance, InjectionKey<I18nComposer>> = new Map()

export type I18nComposerOptions = {
  // TODO:
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  modifiers?: LinkedModifiers
  fallbackRoot?: boolean
}

export type I18nComposer = {
  // TODO:
  // properties
  locale: Locale
  fallbackLocales: Locale[]
  readonly messages: LocaleMessages
  // methods
  t (key: Path, ...args: unknown[]): string
}

export function createI18nComposer (options: I18nComposerOptions = {}): I18nComposer {
  const _locale: Locale = options.locale || 'en-US'
  const _fallbackLocales: Locale[] = options.fallbackLocales || [_locale]
  const _data = reactive({
    locale: _locale,
    fallbackLocales: _fallbackLocales,
    messages: options.messages || { [_locale]: {} }
  })

  const getRuntimeContext = (): RuntimeContext => {
    return createRuntimeContext({
      locale: _data.locale,
      fallbackLocales: _data.fallbackLocales,
      messages: _data.messages
    })
  }
  let _context = getRuntimeContext()

  const t = (key: Path, ...args: unknown[]): string => {
    return localize(_context, key, ...args)
  }

  return {
    /* properties */
    // locale
    get locale (): Locale { return _data.locale },
    set locale (val: Locale) {
      _data.locale = val
      _context = getRuntimeContext()
    },
    // fallbackLocales
    get fallbackLocales (): Locale[] { return _data.fallbackLocales },
    set fallbackLocales (val: Locale[]) {
      _data.fallbackLocales = val
      _context = getRuntimeContext()
    },
    // messages
    get messages (): LocaleMessages { return _data.messages },
    set messages (val: LocaleMessages) {
      _data.messages = val
      _context = getRuntimeContext()
    },
    /* methods */
    t
  }
}

function getProvider (instance: ComponentInternalInstance): InjectionKey<I18nComposer> {
  let current = instance
  let symbol = providers.get(current)
  while (!symbol) {
    if (!current.parent) {
      symbol = GlobalI18nSymbol
      break
    } else {
      current = current.parent
      symbol = providers.get(current)
      if (symbol) {
        break
      }
    }
  }
  return symbol
}

// exports vue-i18n composable API
export function useI18n (options: I18nComposerOptions = {}): I18nComposer {
  const instance = getCurrentInstance()
  const symbol = !instance ? GlobalI18nSymbol : getProvider(instance)
  return inject(symbol) || createI18nComposer(options)
}
