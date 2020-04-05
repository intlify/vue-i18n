/**
 *  Composition
 *
 *  Composition is composable API for vue-i18n
 *  This module is offered composable i18n API for Vue 3
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
import {
  LinkedModifiers,
  PluralizationRules,
  NamedValue
} from './message/context'
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
import {
  translate,
  parseTranslateArgs,
  TranslateOptions
} from './runtime/translate'
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
  /**
   * properties
   */
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

  /**
   * methods
   */
  t(key: Path): string
  t(key: Path, plural: number): string
  t(key: Path, plural: number, options: TranslateOptions): string
  t(key: Path, defaultMsg: string): string
  t(key: Path, defaultMsg: string, options: TranslateOptions): string
  t(key: Path, list: unknown[]): string
  t(key: Path, list: unknown[], plural: number): string
  t(key: Path, list: unknown[], defaultMsg: string): string
  t(key: Path, list: unknown[], options: TranslateOptions): string
  t(key: Path, named: NamedValue): string
  t(key: Path, named: NamedValue, plural: number): string
  t(key: Path, named: NamedValue, defaultMsg: string): string
  t(key: Path, named: NamedValue, options: TranslateOptions): string
  t(...args: unknown[]): string // for internal
  d(value: number | Date): string
  d(value: number | Date, key: string): string
  d(value: number | Date, key: string, locale: Locale): string
  d(value: number | Date, options: DateTimeOptions): string
  d(...args: unknown[]): string // for internal
  n(value: number): string
  n(value: number, key: string): string
  n(value: number, key: string, locale: Locale): string
  n(value: number, options: NumberOptions): string
  n(...args: unknown[]): string // for internal
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
  return (ctx: RuntimeContext, locale: Locale, key: Path): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined)
  }
}

export function createI18nComposer(
  options: I18nComposerOptions = {},
  _root?: I18nComposer // for internal
): I18nComposer {
  // reactivity states
  const _locale = ref<Locale>(
    // prettier-ignore
    _root
      ? _root.locale.value
      : isString(options.locale)
        ? options.locale
        : 'en-US'
  )
  const _fallbackLocales = ref<Locale[]>(
    // prettier-ignore
    _root
      ? _root.fallbackLocales.value
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
  let _missingWarn = _root
    ? _root.missingWarn
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true
  // prettier-ignore
  let _fallbackWarn = _root
    ? _root.fallbackWarn
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
  const _modifiers = _root
    ? _root.modifiers
    : isPlainObject(options.modifiers)
      ? options.modifiers
      : {}

  const _pluralRules = options.pluralRules

  // eslint-disable-next-line prefer-const
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
      _context.locale = _locale.value
    }
  })

  // fallbackLocales
  const fallbackLocales = computed({
    get: () => _fallbackLocales.value,
    set: val => {
      _fallbackLocales.value = val
      _context.fallbackLocales = _fallbackLocales.value
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
    _context.postTranslation = handler
  }

  // getMissingHandler
  const getMissingHandler = (): MissingHandler | null => _missing

  // setMissingHandler
  const setMissingHandler = (handler: MissingHandler | null): void => {
    if (handler !== null) {
      _runtimeMissing = defineRuntimeMissingHandler(handler)
    }
    _missing = handler
    _context.missing = _runtimeMissing
  }

  // t
  const t = (...args: unknown[]): string => {
    return computed<string>((): string => {
      const ret = translate(_context, ...args)
      if (isNumber(ret) && ret === NOT_REOSLVED) {
        const [key] = parseTranslateArgs(...args)
        if (__DEV__ && _fallbackRoot && _root) {
          warn(`Fall back to translate '${key}' with root locale.`)
        }
        return _fallbackRoot && _root ? _root.t(...args) : key
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
      const ret = datetime(_context, ...args)
      if (isNumber(ret) && ret === NOT_REOSLVED) {
        const [, options] = parseDateTimeArgs(...args)
        if (__DEV__ && _fallbackRoot && _root) {
          const key = isString(options.key) ? options.key : ''
          warn(`Fall back to datetime format '${key}' with root locale.`)
        }
        return _fallbackRoot && _root ? _root.d(...args) : MISSING_RESOLVE_VALUE
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
      const ret = number(_context, ...args)
      if (isNumber(ret) && ret === NOT_REOSLVED) {
        const [, options] = parseNumberArgs(...args)
        if (__DEV__ && _fallbackRoot && _root) {
          const key = isString(options.key) ? options.key : ''
          warn(`Fall back to number format '${key}' with root locale.`)
        }
        return _fallbackRoot && _root ? _root.d(...args) : MISSING_RESOLVE_VALUE
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
    _context.messages = _messages.value
  }

  // mergeLocaleMessage
  const mergeLocaleMessage = (locale: Locale, message: LocaleMessage): void => {
    _messages.value[locale] = Object.assign(
      _messages.value[locale] || {},
      message
    )
    _context.messages = _messages.value
  }

  // getDateTimeFormat
  const getDateTimeFormat = (locale: Locale): DateTimeFormat =>
    _datetimeFormats.value[locale] || {}

  // setDateTimeFormat
  const setDateTimeFormat = (locale: Locale, format: DateTimeFormat): void => {
    _datetimeFormats.value[locale] = format
    _context.datetimeFormats = _datetimeFormats.value
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
    _context.datetimeFormats = _datetimeFormats.value
    clearDateTimeFormat(_context, locale, format)
  }

  // getNumberFormat
  const getNumberFormat = (locale: Locale): NumberFormat =>
    _numberFormats.value[locale] || {}

  // setNumberFormat
  const setNumberFormat = (locale: Locale, format: NumberFormat): void => {
    _numberFormats.value[locale] = format
    _context.numberFormats = _numberFormats.value
    clearNumberFormat(_context, locale, format)
  }

  // mergeNumberFormat
  const mergeNumberFormat = (locale: Locale, format: NumberFormat): void => {
    _numberFormats.value[locale] = Object.assign(
      _numberFormats.value[locale] || {},
      format
    )
    _context.numberFormats = _numberFormats.value
    clearNumberFormat(_context, locale, format)
  }

  // export composable APIs!
  return {
    /**
     *  properties
     */
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
      _context.missingWarn = _missingWarn
    },
    get fallbackWarn(): boolean | RegExp {
      return _fallbackWarn
    },
    set fallbackWarn(val: boolean | RegExp) {
      _fallbackWarn = val
      _context.fallbackWarn = _fallbackWarn
    },
    get fallbackRoot(): boolean {
      return _fallbackRoot
    },
    set fallbackRoot(val: boolean) {
      _fallbackRoot = val
    },
    get fallbackFormat(): boolean {
      return _fallbackFormat
    },
    set fallbackFormat(val: boolean) {
      _fallbackFormat = val
      _context.fallbackFormat = _fallbackFormat
    },

    /**
     * methods
     */
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

// vue-i18n composer entry point
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
