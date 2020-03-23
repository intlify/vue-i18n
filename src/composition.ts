/**
 * Composition
 *
 * Composition is composable API for vue-i18n
 * This module is offered composable i18n API for Vue 3
 */

import { InjectionKey, inject, getCurrentInstance, ComponentInternalInstance, ref, computed, readonly } from 'vue'
import { WritableComputedRef, WritableComputedOptions } from '@vue/reactivity'
import { Path } from './path'
import { LinkedModifiers } from './context'
import { Locale, LocaleMessages, createRuntimeContext, localize, RuntimeContext, RuntimeMissingHandler } from './runtime'
import { isFunction } from './utils'

export const GlobalI18nSymbol: InjectionKey<I18nComposer> = Symbol.for('vue-i18n')
const providers: Map<ComponentInternalInstance, InjectionKey<I18nComposer>> = new Map()

export type MissingHandler = (locale: Locale, key: Path, insttance?: ComponentInternalInstance) => string | void

export type I18nComposerOptions = {
  // TODO:
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  missing?: MissingHandler
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
}

export type I18nComposer = {
  // TODO:
  // properties
  locale: WritableComputedRef<Locale>
  fallbackLocales: WritableComputedRef<Locale[]>
  readonly messages: LocaleMessages
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  // methods
  getMissingHandler (): MissingHandler | undefined
  setMissingHandler (handler: MissingHandler): void
  t (key: Path, ...args: unknown[]): string
}

function defineRuntimeMissingHandler (missing: MissingHandler): RuntimeMissingHandler {
  return (ctx: RuntimeContext, locale: Locale, key: Path, ...values: unknown[]): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined)
  }
}

export function createI18nComposer (options: I18nComposerOptions = {}): I18nComposer {
  // reactivity states
  const _locale = ref<Locale>(options.locale || 'en-US')
  const _fallbackLocales = ref<Locale[]>(options.fallbackLocales || [])
  const _messages = ref<LocaleMessages>(options.messages || { [_locale.value]: {} })

  // warning supress options
  let _missingWarn = options.missingWarn === undefined
    ? true
    : options.missingWarn
  let _fallbackWarn = options.fallbackWarn === undefined
    ? _fallbackLocales.value.length > 0
    : options.fallbackWarn

  // setup runtime missing
  let _missing = options.missing
  let _runtimeMissing: RuntimeMissingHandler | undefined = undefined
  if (isFunction(_missing)) {
    _runtimeMissing = defineRuntimeMissingHandler(_missing)
  }

  // TODO: should get ready function for runtime context updating ... object creating cost expensive ...
  const getRuntimeContext = (): RuntimeContext => {
    return createRuntimeContext({
      locale: _locale.value,
      fallbackLocales: _fallbackLocales.value,
      messages: _messages.value,
      missing: _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn
    })
  }
  let _context = getRuntimeContext()

  // locale
  const locale = computed({
    get: () => _locale.value,
    set: val => {
      _locale.value = val
      _context = getRuntimeContext()
    }
  })

  // fallbackLocales
  const fallbackLocales = computed({
    get: () => _fallbackLocales.value,
    set: val => {
      _fallbackLocales.value = val
      _context = getRuntimeContext()
    }
  })

  // missingWarn
  const missingWarn = {
    get missingWarn (): boolean | RegExp { return _missingWarn },
    set missingWarn (val: boolean| RegExp) {
      _missingWarn = val
      _context = getRuntimeContext()
    }
  }

  // fallbackWarn
  const fallbackWarn = {
    get fallbackWarn (): boolean | RegExp { return _fallbackWarn },
    set fallbackWarn (val: boolean| RegExp) {
      _fallbackWarn = val
      _context = getRuntimeContext()
    }
  }

  // messages
  const messages = readonly(_messages)

  // getMissingHandler
  const getMissingHandler = (): MissingHandler | undefined => _missing

  // setMissingHandler
  const setMissingHandler = (handler: MissingHandler): void => {
    _runtimeMissing = defineRuntimeMissingHandler(handler)
    _missing = handler
    _context = getRuntimeContext()
  }

  // t
  const t = (key: Path, ...args: unknown[]): string => {
    return localize(_context, key, ...args)
  }

  return {
    /* properties */
    locale,
    fallbackLocales,
    messages,
    ...missingWarn,
    ...fallbackWarn,
    /* methods */
    getMissingHandler,
    setMissingHandler,
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
