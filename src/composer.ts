/**
 *  Composer
 *
 *  Composer is offered composable API for Vue 3
 *  This module is offered new style vue-i18n API
 */

import {
  ref,
  computed,
  getCurrentInstance,
  ComponentInternalInstance,
  Text,
  createVNode,
  watch,
  VNode,
  VNodeArrayChildren
} from 'vue'
import { WritableComputedRef, ComputedRef } from '@vue/reactivity'
import { Path, parse as parsePath } from './path'
import {
  DateTimeFormats,
  NumberFormats,
  DateTimeFormat,
  NumberFormat
} from './core/types'
import {
  LinkedModifiers,
  PluralizationRules,
  NamedValue,
  MessageFunctions,
  MessageProcessor,
  MessageType
} from './message/runtime'
import {
  Locale,
  LocaleMessages,
  createRuntimeContext,
  RuntimeContext,
  RuntimeMissingHandler,
  LocaleMessage,
  PostTranslationHandler,
  MISSING_RESOLVE_VALUE,
  updateFallbackLocale,
  FallbackLocale
} from './core/context'
import {
  translate,
  parseTranslateArgs,
  TranslateOptions
} from './core/translate'
import {
  datetime,
  parseDateTimeArgs,
  clearDateTimeFormat,
  DateTimeOptions
} from './core/datetime'
import {
  number,
  parseNumberArgs,
  clearNumberFormat,
  NumberOptions
} from './core/number'
import { NOT_REOSLVED } from './core/context'
import { I18nWarnCodes, getWarnMessage } from './warnings'
import { I18nErrorCodes, createI18nError } from './errors'
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

// extend VNode interface
declare module '@vue/runtime-core' {
  interface VNode<HostNode = RendererNode, HostElement = RendererElement> {
    toString: () => string // mark for vue-i18n message runtime
  }
}

export type VueMessageType = string | VNode
export type MissingHandler = (
  locale: Locale,
  key: Path,
  insttance?: ComponentInternalInstance,
  type?: string
) => string | void

export type PreCompileHandler<T = VueMessageType> = () => {
  messages: LocaleMessages
  functions: MessageFunctions<T>
}

export type CustomBlocks<T = VueMessageType> =
  | Array<string | LocaleMessages>
  | PreCompileHandler<T>

/**
 * Composer Options
 *
 * @remarks
 * This is options to create composer.
 */
export interface ComposerOptions<T = VueMessageType> {
  locale?: Locale
  fallbackLocale?: FallbackLocale
  inheritLocale?: boolean
  messages?: LocaleMessages
  datetimeFormats?: DateTimeFormats
  numberFormats?: NumberFormats
  modifiers?: LinkedModifiers<T>
  pluralRules?: PluralizationRules
  missing?: MissingHandler
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackRoot?: boolean
  fallbackFormat?: boolean
  postTranslation?: PostTranslationHandler<T>
  warnHtmlMessage?: boolean
}

/**
 * @internal
 */
export interface ComposerInternalOptions<T = VueMessageType> {
  __i18n?: CustomBlocks<T>
  __root?: Composer<T>
}

/**
 * Composer Interfaces
 *
 * @remarks
 * This is the interface for being used for Vue 3 Composition API.
 */
export interface Composer<T = VueMessageType> {
  // properties
  locale: WritableComputedRef<Locale>
  fallbackLocale: WritableComputedRef<FallbackLocale>
  inheritLocale: boolean
  readonly availableLocales: Locale[]
  readonly messages: ComputedRef<LocaleMessages>
  readonly datetimeFormats: ComputedRef<DateTimeFormats>
  readonly numberFormats: ComputedRef<NumberFormats>
  readonly modifiers: LinkedModifiers<T>
  readonly pluralRules?: PluralizationRules
  readonly isGlobal: boolean
  missingWarn: boolean | RegExp
  fallbackWarn: boolean | RegExp
  fallbackRoot: boolean
  fallbackFormat: boolean
  warnHtmlMessage: boolean
  // methods
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
  getPostTranslationHandler(): PostTranslationHandler<T> | null
  setPostTranslationHandler(handler: PostTranslationHandler<T> | null): void
  getMissingHandler(): MissingHandler | null
  setMissingHandler(handler: MissingHandler | null): void
}

/**
 * @internal
 */
export interface ComposerInternal {
  __id: number
  __transrateVNode(...args: unknown[]): VNodeArrayChildren
  __numberParts(...args: unknown[]): string | Intl.NumberFormatPart[]
  __datetimeParts(...args: unknown[]): string | Intl.DateTimeFormatPart[]
}

type ComposerWarnType = 'translate' | 'number format' | 'datetime format'

let composerID = 0

function defineRuntimeMissingHandler<T = VueMessageType>(
  missing: MissingHandler
): RuntimeMissingHandler<T> {
  return (
    ctx: RuntimeContext<T>,
    locale: Locale,
    key: Path,
    type: string
  ): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined, type)
  }
}

function getLocaleMessages<T = VueMessageType>(
  options: ComposerOptions<T> & ComposerInternalOptions<T>,
  locale: Locale
): LocaleMessages {
  const { messages, __i18n } = options

  // prettier-ignore
  let ret = isPlainObject(messages)
    ? messages
    : isArray(__i18n)
      ? {}
      : { [locale]: {} }

  // merge locale messages of i18n custom block
  if (isArray(__i18n)) {
    __i18n.forEach(raw => {
      ret = Object.assign(ret, isString(raw) ? JSON.parse(raw) : raw)
    })
    return ret
  }

  if (isFunction(__i18n)) {
    const { functions } = __i18n()
    addPreCompileMessages<T>(ret, functions as MessageFunctions<T>)
  }

  return ret
}

export function addPreCompileMessages<T = VueMessageType>(
  messages: LocaleMessages,
  functions: MessageFunctions<T>
): void {
  const keys = Object.keys(functions)
  keys.forEach(key => {
    const compiled = functions[key]
    const { l, k } = JSON.parse(key)
    if (!messages[l]) {
      messages[l] = {}
    }
    const targetLocaleMessage = messages[l]
    const paths = parsePath(k)
    if (paths != null) {
      const len = paths.length
      let last = targetLocaleMessage as any // eslint-disable-line @typescript-eslint/no-explicit-any
      let i = 0
      while (i < len) {
        const path = paths[i]
        if (i === len - 1) {
          last[path] = compiled
          break
        } else {
          let val = last[path]
          if (!val) {
            last[path] = val = {}
          }
          last = val
          i++
        }
      }
    }
  })
}

/**
 * Create composer interface factory
 *
 * @internal
 */
export function createComposer<T = VueMessageType>(
  options: ComposerOptions<T> & ComposerInternalOptions<T> = {}
): Composer<T> {
  const { __root } = options
  const _isGlobal = __root === undefined

  let _inheritLocale = isBoolean(options.inheritLocale)
    ? options.inheritLocale
    : true

  const _locale = ref<Locale>(
    // prettier-ignore
    __root && _inheritLocale
      ? __root.locale.value
      : isString(options.locale)
        ? options.locale
        : 'en-US'
  )

  const _fallbackLocale = ref<FallbackLocale>(
    // prettier-ignore
    __root && _inheritLocale
      ? __root.fallbackLocale.value
      : isString(options.fallbackLocale) ||
        isArray(options.fallbackLocale) ||
        isPlainObject(options.fallbackLocale) ||
        options.fallbackLocale === false
        ? options.fallbackLocale
        : _locale.value
  )

  const _messages = ref<LocaleMessages>(
    getLocaleMessages<T>(options, _locale.value)
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
  let _missingWarn = __root
    ? __root.missingWarn
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true

  // prettier-ignore
  let _fallbackWarn = __root
    ? __root.fallbackWarn
    : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true

  let _fallbackRoot = isBoolean(options.fallbackRoot)
    ? options.fallbackRoot
    : true

  // configure fall bakck to root
  let _fallbackFormat = !!options.fallbackFormat

  // runtime missing
  let _missing = isFunction(options.missing) ? options.missing : null
  let _runtimeMissing = isFunction(options.missing)
    ? defineRuntimeMissingHandler<T>(options.missing)
    : null

  // postTranslation handler
  let _postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null

  let _warnHtmlMessage = isBoolean(options.warnHtmlMessage)
    ? options.warnHtmlMessage
    : true

  // custom linked modifiers
  // prettier-ignore
  const _modifiers = __root
    ? __root.modifiers
    : isPlainObject(options.modifiers)
      ? options.modifiers
      : {} as LinkedModifiers<T>

  // pluralRules
  const _pluralRules = options.pluralRules

  // runtime context
  let _context: RuntimeContext<T> // eslint-disable-line prefer-const
  function getRuntimeContext(): RuntimeContext<T> {
    return createRuntimeContext<T>({
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
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
      warnHtmlMessage: _warnHtmlMessage,
      _datetimeFormatters: isPlainObject(_context)
        ? _context._datetimeFormatters
        : undefined,
      _numberFormatters: isPlainObject(_context)
        ? _context._numberFormatters
        : undefined
    })
  }
  _context = getRuntimeContext()
  updateFallbackLocale<T>(_context, _locale.value, _fallbackLocale.value)

  /*!
   * define properties
   */

  // locale
  const locale = computed({
    get: () => _locale.value,
    set: val => {
      _locale.value = val
      _context.locale = _locale.value
    }
  })

  // fallbackLocale
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: val => {
      _fallbackLocale.value = val
      _context.fallbackLocale = _fallbackLocale.value
      updateFallbackLocale(_context, _locale.value, val)
    }
  })

  // messages
  const messages = computed(() => _messages.value)

  // datetimeFormats
  const datetimeFormats = computed(() => _datetimeFormats.value)

  // numberFormats
  const numberFormats = computed(() => _numberFormats.value)

  /**
   * define methods
   */

  // getPostTranslationHandler
  const getPostTranslationHandler = (): PostTranslationHandler<T> | null =>
    isFunction(_postTranslation) ? _postTranslation : null

  // setPostTranslationHandler
  function setPostTranslationHandler(
    handler: PostTranslationHandler<T> | null
  ): void {
    _postTranslation = handler
    _context.postTranslation = handler
  }

  // getMissingHandler
  const getMissingHandler = (): MissingHandler | null => _missing

  // setMissingHandler
  function setMissingHandler(handler: MissingHandler | null): void {
    if (handler !== null) {
      _runtimeMissing = defineRuntimeMissingHandler(handler)
    }
    _missing = handler
    _context.missing = _runtimeMissing
  }

  function defineComputed<T, U = T>(
    fn: (context: unknown) => unknown,
    argumentParser: () => string,
    warnType: ComposerWarnType,
    fallbackSuccess: (root: Composer<T> & ComposerInternal) => U,
    fallbackFail: (key: string) => U,
    successCondition: (val: unknown) => boolean
  ): ComputedRef<U> {
    return computed<U>(
      (): U => {
        const ret = fn(getRuntimeContext())
        if (isNumber(ret) && ret === NOT_REOSLVED) {
          const key = argumentParser()
          if (__DEV__ && _fallbackRoot && __root) {
            warn(
              getWarnMessage(I18nWarnCodes.FALLBACK_TO_ROOT, {
                key,
                type: warnType
              })
            )
          }
          return _fallbackRoot && __root
            ? fallbackSuccess(
                (__root as unknown) as Composer<T> & ComposerInternal
              )
            : fallbackFail(key)
        } else if (successCondition(ret)) {
          return ret as U
        } else {
          /* istanbul ignore next */
          throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE)
        }
      }
    )
  }

  // t
  function t(...args: unknown[]): string {
    return defineComputed<string>(
      context => translate<string>(context as RuntimeContext<string>, ...args),
      () => parseTranslateArgs(...args)[0],
      'translate',
      root => root.t(...args),
      key => key,
      val => isString(val)
    ).value
  }

  // d
  function d(...args: unknown[]): string {
    return defineComputed<string>(
      context => datetime<string>(context as RuntimeContext<string>, ...args),
      () => parseDateTimeArgs(...args)[0],
      'datetime format',
      root => root.d(...args),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    ).value
  }

  // n
  function n(...args: unknown[]): string {
    return defineComputed<string>(
      context => number<string>(context as RuntimeContext<string>, ...args),
      () => parseNumberArgs(...args)[0],
      'number format',
      root => root.n(...args),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    ).value
  }

  // for custom processor
  function normalize(
    values: MessageType<string | VNode>[]
  ): MessageType<VNode>[] {
    return values.map(val =>
      isString(val) ? createVNode(Text, null, val, 0) : val
    )
  }
  const interpolate = (val: unknown): MessageType<VNode> => val as VNode
  const processor = {
    normalize,
    interpolate
  } as MessageProcessor<VNode>

  // __transrateVNode, using for `i18n-t` component
  function __transrateVNode(...args: unknown[]): VNodeArrayChildren {
    return defineComputed<VNode, VNodeArrayChildren>(
      context => {
        let ret: unknown
        try {
          const _context = context as RuntimeContext<VNode>
          _context.processor = processor
          ret = translate<VNode>(_context, ...args)
        } finally {
          _context.processor = null
        }
        return ret
      },
      () => parseTranslateArgs(...args)[0],
      'translate',
      root => root.__transrateVNode(...args),
      key => [createVNode(Text, null, key, 0)],
      val => isArray(val)
    ).value
  }

  // __numberParts, using for `i18n-n` component
  function __numberParts(...args: unknown[]): string | Intl.NumberFormatPart[] {
    return defineComputed<string | Intl.NumberFormatPart[]>(
      context => number(context as RuntimeContext<string>, ...args),
      () => parseNumberArgs(...args)[0],
      'number format',
      root => root.__numberParts(...args),
      () => [],
      val => isString(val) || isArray(val)
    ).value
  }

  // __datetimeParts, using for `i18n-d` component
  function __datetimeParts(
    ...args: unknown[]
  ): string | Intl.DateTimeFormatPart[] {
    return defineComputed<string | Intl.DateTimeFormatPart[]>(
      context => datetime(context as RuntimeContext<string>, ...args),
      () => parseDateTimeArgs(...args)[0],
      'datetime format',
      root => root.__datetimeParts(...args),
      () => [],
      val => isString(val) || isArray(val)
    ).value
  }

  // getLocaleMessage
  const getLocaleMessage = (locale: Locale): LocaleMessage =>
    _messages.value[locale] || {}

  // setLocaleMessage
  function setLocaleMessage(locale: Locale, message: LocaleMessage) {
    _messages.value[locale] = message
    _context.messages = _messages.value
  }

  // mergeLocaleMessage
  function mergeLocaleMessage(locale: Locale, message: LocaleMessage): void {
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
  function setDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = format
    _context.datetimeFormats = _datetimeFormats.value
    clearDateTimeFormat<T>(_context, locale, format)
  }

  // mergeDateTimeFormat
  function mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = Object.assign(
      _datetimeFormats.value[locale] || {},
      format
    )
    _context.datetimeFormats = _datetimeFormats.value
    clearDateTimeFormat<T>(_context, locale, format)
  }

  // getNumberFormat
  const getNumberFormat = (locale: Locale): NumberFormat =>
    _numberFormats.value[locale] || {}

  // setNumberFormat
  function setNumberFormat(locale: Locale, format: NumberFormat): void {
    _numberFormats.value[locale] = format
    _context.numberFormats = _numberFormats.value
    clearNumberFormat<T>(_context, locale, format)
  }

  // mergeNumberFormat
  function mergeNumberFormat(locale: Locale, format: NumberFormat): void {
    _numberFormats.value[locale] = Object.assign(
      _numberFormats.value[locale] || {},
      format
    )
    _context.numberFormats = _numberFormats.value
    clearNumberFormat<T>(_context, locale, format)
  }

  // for debug
  composerID++

  // watch root locale & fallbackLocale
  if (__root) {
    watch(__root.locale, (val: Locale) => {
      if (_inheritLocale) {
        _locale.value = val
        _context.locale = val
        updateFallbackLocale<T>(_context, _locale.value, _fallbackLocale.value)
      }
    })
    watch(__root.fallbackLocale, (val: FallbackLocale) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val
        _context.fallbackLocale = val
        updateFallbackLocale<T>(_context, _locale.value, _fallbackLocale.value)
      }
    })
  }

  // export composable API!
  const composer = {
    // properties
    locale,
    fallbackLocale,
    get inheritLocale(): boolean {
      return _inheritLocale
    },
    set inheritLocale(val: boolean) {
      _inheritLocale = val
      if (val && __root) {
        _locale.value = __root.locale.value
        _fallbackLocale.value = __root.fallbackLocale.value
        updateFallbackLocale<T>(_context, _locale.value, _fallbackLocale.value)
      }
    },
    get availableLocales(): Locale[] {
      return Object.keys(_messages.value).sort()
    },
    messages,
    datetimeFormats,
    numberFormats,
    get modifiers(): LinkedModifiers<T> {
      return _modifiers
    },
    get pluralRules(): PluralizationRules | undefined {
      return _pluralRules
    },
    get isGlobal(): boolean {
      return _isGlobal
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
    get warnHtmlMessage(): boolean {
      return _warnHtmlMessage
    },
    set warnHtmlMessage(val: boolean) {
      _warnHtmlMessage = val
      _context.warnHtmlMessage = val
    },
    __id: composerID,
    // methods
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
    setMissingHandler,
    __transrateVNode,
    __numberParts,
    __datetimeParts
  }

  return composer
}
