/**
 * Composition
 *
 * Composition is composable API for vue-i18n
 * This module is offered composable i18n API for Vue 3
 */

import { InjectionKey, provide, inject, getCurrentInstance, ComponentInternalInstance, ref, computed } from 'vue'
import { WritableComputedRef, ComputedRef } from '@vue/reactivity'
import { Path } from './path'
import { LinkedModifiers, PluralizationRules } from './message/context'
import { Locale, LocaleMessages, createRuntimeContext, RuntimeContext, RuntimeMissingHandler, LocaleMessage } from './runtime/context'
import { translate, TRANSLATE_NOT_REOSLVED } from './runtime/localize'
import { warn, isFunction, isNumber, isString } from './utils'

export const GlobalI18nSymbol: InjectionKey<I18nComposer> = Symbol.for('vue-i18n')
const providers: Map<ComponentInternalInstance, InjectionKey<I18nComposer>> = new Map()

export type MissingHandler = (locale: Locale, key: Path, insttance?: ComponentInternalInstance) => string | void

export type I18nComposerOptions = {
  // TODO:
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  modifiers?: LinkedModifiers
  pluralRules?: PluralizationRules
  missing?: MissingHandler
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackRoot?: boolean
  fallbackFormat?: boolean
}

export type I18nComposer = {
  // TODO:
  /* properties */
  locale: WritableComputedRef<Locale>
  fallbackLocales: WritableComputedRef<Locale[]>
  readonly availableLocales: Locale[]
  readonly messages: ComputedRef<LocaleMessages>
  readonly modifiers: LinkedModifiers
  readonly pluralRules?: PluralizationRules
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackRoot: boolean
  fallbackFormat: boolean
  /* methods */
  t (key: Path, ...args: unknown[]): string
  getLocaleMessage (locale: Locale): LocaleMessage
  setLocaleMessage (locale: Locale, message: LocaleMessage): void
  mergeLocaleMessage (locale: Locale, message: LocaleMessage): void
  getMissingHandler (): MissingHandler | undefined
  setMissingHandler (handler: MissingHandler): void
}

function defineRuntimeMissingHandler (missing: MissingHandler): RuntimeMissingHandler {
  return (ctx: RuntimeContext, locale: Locale, key: Path, ...values: unknown[]): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined)
  }
}

export function createI18nComposer (options: I18nComposerOptions = {}, root?: I18nComposer): I18nComposer {
  // reactivity states
  const _locale = ref<Locale>(root ? root.locale.value : options.locale || 'en-US')
  const _fallbackLocales = ref<Locale[]>(root ? root.fallbackLocales.value : options.fallbackLocales || [])
  const _messages = ref<LocaleMessages>(options.messages || { [_locale.value]: {} })

  // warning supress options
  let _missingWarn = root
    ? root.missingWarn
    : options.missingWarn === undefined
      ? true
      : options.missingWarn
  let _fallbackWarn = root
    ? root.fallbackWarn
    : options.fallbackWarn === undefined
      ? _fallbackLocales.value.length > 0
      : options.fallbackWarn
  let _fallbackRoot = options.fallbackRoot === undefined
    ? true
    : !!options.fallbackRoot
  let _fallbackFormat = options.fallbackFormat === undefined
    ? false
    : !!options.fallbackFormat

  // runtime missing
  let _missing = options.missing
  let _runtimeMissing: RuntimeMissingHandler | undefined
  if (isFunction(_missing)) {
    _runtimeMissing = defineRuntimeMissingHandler(_missing)
  }

  // custom linked modifiers
  const _modifiers = root
    ? root.modifiers
    : options.modifiers === undefined
      ? {}
      : options.modifiers

  const _pluralRules = options.pluralRules

  // TODO: should get ready function for runtime context updating ... object creating cost expensive ...
  const getRuntimeContext = (): RuntimeContext => {
    return createRuntimeContext({
      locale: _locale.value,
      fallbackLocales: _fallbackLocales.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true
    })
  }
  let _context = getRuntimeContext() // eslint-disable-line

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

  // messages
  const messages = computed(() => _messages.value)

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
    return computed<string>((): string => {
      const ret = translate(getRuntimeContext(), key, ...args)
      if (isNumber(ret) && ret === TRANSLATE_NOT_REOSLVED) {
        if (__DEV__ && _fallbackRoot && root) {
          warn(`Fall back to translate '${key}' with root locale.`)
        }
        return _fallbackRoot && root
          ? root.t(key, ...args)
          : key
      } else if (isString(ret)) {
        return ret
      } else {
        throw new Error('TODO:') // TODO
      }
    }).value
  }

  // getLocaleMessage
  const getLocaleMessage = (locale: Locale): LocaleMessage => _messages.value[locale] || {}

  // setLocaleMessage
  const setLocaleMessage = (locale: Locale, message: LocaleMessage): void => {
    _messages.value[locale] = message
  }

  // mergeLocaleMessage
  const mergeLocaleMessage = (locale: Locale, message: LocaleMessage): void => {
    _messages.value[locale] = Object.assign(_messages.value[locale] || {}, message)
  }

  return {
    /* properties */
    locale,
    fallbackLocales,
    get availableLocales (): Locale[] { return Object.keys(_messages.value).sort() },
    messages,
    get modifiers (): LinkedModifiers { return _modifiers },
    get pluralRules (): PluralizationRules | undefined { return _pluralRules },
    get missingWarn (): boolean | RegExp { return _missingWarn },
    set missingWarn (val: boolean | RegExp) {
      _missingWarn = val
      _context = getRuntimeContext()
    },
    get fallbackWarn (): boolean | RegExp { return _fallbackWarn },
    set fallbackWarn (val: boolean | RegExp) {
      _fallbackWarn = val
      _context = getRuntimeContext()
    },
    get fallbackRoot (): boolean { return _fallbackRoot },
    set fallbackRoot (val: boolean) {
      _fallbackRoot = val
      _context = getRuntimeContext()
    },
    get fallbackFormat (): boolean { return _fallbackFormat },
    set fallbackFormat (val: boolean) {
      _fallbackFormat = val
      _context = getRuntimeContext()
    },
    /* methods */
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getMissingHandler,
    setMissingHandler
  }
}

const generateSymbolID = (): string => `vue-i18n-${new Date().getUTCMilliseconds().toString()}`

// exports vue-i18n composable API
export function useI18n (options?: I18nComposerOptions): I18nComposer {
  const globalComposer = inject(GlobalI18nSymbol)
  if (!globalComposer) throw new Error('TODO') // TODO:

  const instance = getCurrentInstance()
  if (instance === null || !options) { return globalComposer }

  const symbol = providers.get(instance)
  if (!symbol) {
    const composer = createI18nComposer(options, globalComposer)
    const sym: InjectionKey<I18nComposer> = Symbol.for(generateSymbolID())
    providers.set(instance, sym)
    provide(sym, composer)
    return composer
  } else {
    const composer = inject(symbol) || globalComposer
    if (!composer) throw new Error('TODO') // TODO:
    return composer
  }
}
