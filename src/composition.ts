/**
 * Composition
 *
 * Composition is composable API for vue-i18n
 * This module is offered composable i18n API for Vue 3
 */

import {
  ref,
  computed,
  provide,
  inject,
  InjectionKey,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'
import { WritableComputedRef, ComputedRef } from '@vue/reactivity'
import { Path } from './path'
import {
  DateTimeFormats,
  NumberFormats,
  DateTimeFormat,
  NumberFormat
} from './runtime/types'
import { LinkedModifiers, PluralizationRules } from './message/context'
import {
  Locale,
  LocaleMessages,
  createRuntimeContext,
  RuntimeContext,
  RuntimeMissingHandler,
  LocaleMessage,
  PostTranslationHandler,
  MISSING_RESOLVE_VALUE
} from './runtime/context'
import { translate } from './runtime/localize'
import {
  datetime,
  parseDateTimeArgs,
  clearDateTimeFormat,
  DateTimeOptions
} from './runtime/datetime'
import {
  number,
  parseNumberArgs,
  clearNumberFormat,
  NumberOptions
} from './runtime/number'
import { NOT_REOSLVED } from './runtime/context'
import {
  warn,
  isArray,
  isFunction,
  isNumber,
  isString,
  isRegExp,
  isBoolean,
  isPlainObject
} from './utils'

export const GlobalI18nSymbol: InjectionKey<I18nComposer> = Symbol.for(
  'vue-i18n'
)
const providers: Map<
  ComponentInternalInstance,
  InjectionKey<I18nComposer>
> = new Map()

export type MissingHandler = (
  locale: Locale,
  key: Path,
  insttance?: ComponentInternalInstance
) => string | void

export type I18nComposerOptions = {
  // TODO:
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  datetimeFormats?: DateTimeFormats
  numberFormats?: NumberFormats
  modifiers?: LinkedModifiers
  pluralRules?: PluralizationRules
  missing?: MissingHandler
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackRoot?: boolean
  fallbackFormat?: boolean
  postTranslation?: PostTranslationHandler
}

export type I18nComposer = {
  // TODO:
  /* properties */
  locale: WritableComputedRef<Locale>
  fallbackLocales: WritableComputedRef<Locale[]>
  readonly availableLocales: Locale[]
  readonly messages: ComputedRef<LocaleMessages>
  readonly datetimeFormats: ComputedRef<DateTimeFormats>
  readonly numberFormats: ComputedRef<NumberFormats>
  readonly modifiers: LinkedModifiers
  readonly pluralRules?: PluralizationRules
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackRoot: boolean
  fallbackFormat: boolean
  /* methods */
  t(key: Path, ...args: unknown[]): string
  d(value: number | Date): string
  d(value: number | Date, key: string): string
  d(value: number | Date, key: string, locale: Locale): string
  d(value: number | Date, options: DateTimeOptions): string
  n(value: number): string
  n(value: number, key: string): string
  n(value: number, key: string, locale: Locale): string
  n(value: number, options: NumberOptions): string
  getLocaleMessage(locale: Locale): LocaleMessage
  setLocaleMessage(locale: Locale, message: LocaleMessage): void
  mergeLocaleMessage(locale: Locale, message: LocaleMessage): void
  getDateTimeFormat(locale: Locale): DateTimeFormat
  setDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  getNumberFormat(locale: Locale): NumberFormat
  setNumberFormat(locale: Locale, format: NumberFormat): void
  mergeNumberFormat(locale: Locale, format: NumberFormat): void
  getPostTranslationHandler(): PostTranslationHandler | null
  setPostTranslationHandler(handler: PostTranslationHandler | null): void
  getMissingHandler(): MissingHandler | null
  setMissingHandler(handler: MissingHandler | null): void
}

function defineRuntimeMissingHandler(
  missing: MissingHandler
): RuntimeMissingHandler {
  return (
    ctx: RuntimeContext,
    locale: Locale,
    key: Path,
    ...values: unknown[]
  ): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined)
  }
}

export function createI18nComposer(
  options: I18nComposerOptions = {},
  root?: I18nComposer
): I18nComposer {
  // reactivity states
  const _locale = ref<Locale>(
    // prettier-ignore
    root
      ? root.locale.value
      : isString(options.locale)
        ? options.locale
        : 'en-US'
  )
  const _fallbackLocales = ref<Locale[]>(
    // prettier-ignore
    root
      ? root.fallbackLocales.value
      : isArray(options.fallbackLocales)
        ? options.fallbackLocales
        : []
  )
  const _messages = ref<LocaleMessages>(
    isPlainObject(options.messages) ? options.messages : { [_locale.value]: {} }
  )
  const _datetimeFormats = ref<DateTimeFormats>(
    isPlainObject(options.datetimeFormats)
      ? options.datetimeFormats
      : { [_locale.value]: {} }
  )
  const _numberFormats = ref<NumberFormats>(
    isPlainObject(options.numberFormats)
      ? options.numberFormats
      : { [_locale.value]: {} }
  )

  // warning supress options
  // prettier-ignore
  let _missingWarn = root
    ? root.missingWarn
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true
  // prettier-ignore
  let _fallbackWarn = root
    ? root.fallbackWarn
    : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true
  let _fallbackRoot = isBoolean(options.fallbackRoot)
    ? options.fallbackRoot
    : true

  // configure fall bakck to root
  let _fallbackFormat = isBoolean(options.fallbackFormat)
    ? options.fallbackFormat
    : false

  // runtime missing
  let _missing = isFunction(options.missing) ? options.missing : null
  let _runtimeMissing = isFunction(options.missing)
    ? defineRuntimeMissingHandler(options.missing)
    : null

  // postTranslation handler
  let _postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null

  // custom linked modifiers
  // prettier-ignore
  const _modifiers = root
    ? root.modifiers
    : isPlainObject(options.modifiers)
      ? options.modifiers
      : {}

  const _pluralRules = options.pluralRules

  // TODO: should get ready function for runtime context updating ... object creating cost expensive ...
  let _context: RuntimeContext
  const getRuntimeContext = (): RuntimeContext => {
    return createRuntimeContext({
      locale: _locale.value,
      fallbackLocales: _fallbackLocales.value,
      messages: _messages.value,
      datetimeFormats: _datetimeFormats.value,
      numberFormats: _numberFormats.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? undefined : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? undefined : _postTranslation,
      _compileCache: isPlainObject(_context)
        ? _context._compileCache
        : undefined,
      _datetimeFormatters: isPlainObject(_context)
        ? _context._datetimeFormatters
        : undefined,
      _numberFormatters: isPlainObject(_context)
        ? _context._numberFormatters
        : undefined
    })
  }
  _context = getRuntimeContext()

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

  // datetimeFormats
  const datetimeFormats = computed(() => _datetimeFormats.value)

  // numberFormats
  const numberFormats = computed(() => _numberFormats.value)

  // getPostTranslationHandler
  const getPostTranslationHandler = (): PostTranslationHandler | null =>
    isFunction(_postTranslation) ? _postTranslation : null

  // setPostTranslationHandler
  const setPostTranslationHandler = (
    handler: PostTranslationHandler | null
  ): void => {
    _postTranslation = handler
    _context = getRuntimeContext()
  }

  // getMissingHandler
  const getMissingHandler = (): MissingHandler | null => _missing

  // setMissingHandler
  const setMissingHandler = (handler: MissingHandler | null): void => {
    if (handler !== null) {
      _runtimeMissing = defineRuntimeMissingHandler(handler)
    }
    _missing = handler
    _context = getRuntimeContext()
  }

  // t
  const t = (key: Path, ...args: unknown[]): string => {
    return computed<string>((): string => {
      const ret = translate(getRuntimeContext(), key, ...args)
      if (isNumber(ret) && ret === NOT_REOSLVED) {
        if (__DEV__ && _fallbackRoot && root) {
          warn(`Fall back to translate '${key}' with root locale.`)
        }
        return _fallbackRoot && root ? root.t(key, ...args) : key
      } else if (isString(ret)) {
        return ret
      } else {
        throw new Error('TODO:') // TODO
      }
    }).value
  }

  // d
  const d = (...args: unknown[]): string => {
    return computed<string>((): string => {
      const [value, options] = parseDateTimeArgs(...args)
      const ret = datetime(getRuntimeContext(), value, options)
      if (isNumber(ret) && ret === NOT_REOSLVED) {
        if (__DEV__ && _fallbackRoot && root) {
          const key = isString(options.key) ? options.key : ''
          warn(`Fall back to datetime format '${key}' with root locale.`)
        }
        return _fallbackRoot && root
          ? root.d(value, options)
          : MISSING_RESOLVE_VALUE
      } else if (isString(ret)) {
        return ret
      } else {
        throw new Error('TODO:') // TODO
      }
    }).value
  }

  // n
  const n = (...args: unknown[]): string => {
    return computed<string>((): string => {
      const [value, options] = parseNumberArgs(...args)
      const ret = number(getRuntimeContext(), value, options)
      if (isNumber(ret) && ret === NOT_REOSLVED) {
        if (__DEV__ && _fallbackRoot && root) {
          const key = isString(options.key) ? options.key : ''
          warn(`Fall back to number format '${key}' with root locale.`)
        }
        return _fallbackRoot && root
          ? root.d(value, options)
          : MISSING_RESOLVE_VALUE
      } else if (isString(ret)) {
        return ret
      } else {
        throw new Error('TODO:') // TODO
      }
    }).value
  }

  // getLocaleMessage
  const getLocaleMessage = (locale: Locale): LocaleMessage =>
    _messages.value[locale] || {}

  // setLocaleMessage
  const setLocaleMessage = (locale: Locale, message: LocaleMessage): void => {
    _messages.value[locale] = message
    _context = getRuntimeContext()
  }

  // mergeLocaleMessage
  const mergeLocaleMessage = (locale: Locale, message: LocaleMessage): void => {
    _messages.value[locale] = Object.assign(
      _messages.value[locale] || {},
      message
    )
    _context = getRuntimeContext()
  }

  // getDateTimeFormat
  const getDateTimeFormat = (locale: Locale): DateTimeFormat =>
    _datetimeFormats.value[locale] || {}

  // setDateTimeFormat
  const setDateTimeFormat = (locale: Locale, format: DateTimeFormat): void => {
    _datetimeFormats.value[locale] = format
    _context = getRuntimeContext()
    clearDateTimeFormat(_context, locale, format)
  }

  // mergeDateTimeFormat
  const mergeDateTimeFormat = (
    locale: Locale,
    format: DateTimeFormat
  ): void => {
    _datetimeFormats.value[locale] = Object.assign(
      _datetimeFormats.value[locale] || {},
      format
    )
    _context = getRuntimeContext()
    clearDateTimeFormat(_context, locale, format)
  }

  // getNumberFormat
  const getNumberFormat = (locale: Locale): NumberFormat =>
    _numberFormats.value[locale] || {}

  // setNumberFormat
  const setNumberFormat = (locale: Locale, format: NumberFormat): void => {
    _numberFormats.value[locale] = format
    _context = getRuntimeContext()
    clearNumberFormat(_context, locale, format)
  }

  // mergeNumberFormat
  const mergeNumberFormat = (locale: Locale, format: NumberFormat): void => {
    _numberFormats.value[locale] = Object.assign(
      _numberFormats.value[locale] || {},
      format
    )
    _context = getRuntimeContext()
    clearNumberFormat(_context, locale, format)
  }

  return {
    /* properties */
    locale,
    fallbackLocales,
    get availableLocales(): Locale[] {
      return Object.keys(_messages.value).sort()
    },
    messages,
    datetimeFormats,
    numberFormats,
    get modifiers(): LinkedModifiers {
      return _modifiers
    },
    get pluralRules(): PluralizationRules | undefined {
      return _pluralRules
    },
    get missingWarn(): boolean | RegExp {
      return _missingWarn
    },
    set missingWarn(val: boolean | RegExp) {
      _missingWarn = val
      _context = getRuntimeContext()
    },
    get fallbackWarn(): boolean | RegExp {
      return _fallbackWarn
    },
    set fallbackWarn(val: boolean | RegExp) {
      _fallbackWarn = val
      _context = getRuntimeContext()
    },
    get fallbackRoot(): boolean {
      return _fallbackRoot
    },
    set fallbackRoot(val: boolean) {
      _fallbackRoot = val
      _context = getRuntimeContext()
    },
    get fallbackFormat(): boolean {
      return _fallbackFormat
    },
    set fallbackFormat(val: boolean) {
      _fallbackFormat = val
      _context = getRuntimeContext()
    },
    /* methods */
    t,
    d,
    n,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler
  }
}

const generateSymbolID = (): string =>
  `vue-i18n-${new Date().getUTCMilliseconds().toString()}`

// exports vue-i18n composable API
export function useI18n(options?: I18nComposerOptions): I18nComposer {
  const globalComposer = inject(GlobalI18nSymbol)
  if (!globalComposer) throw new Error('TODO') // TODO:

  const instance = getCurrentInstance()
  if (instance === null || !options) {
    return globalComposer
  }

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
