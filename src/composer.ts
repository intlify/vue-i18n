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
import { Path, parse as parsePath, resolveValue } from './path'
import {
  DateTimeFormats as DateTimeFormatsType,
  NumberFormats as NumberFormatsType,
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
  LocaleMessageValue,
  LocaleMessages,
  createRuntimeContext,
  RuntimeContext,
  RuntimeCommonContext,
  RuntimeTranslationContext,
  RuntimeDateTimeContext,
  RuntimeNumberContext,
  RuntimeMissingHandler,
  RuntimeOptions,
  LocaleMessageDictionary,
  PostTranslationHandler,
  MISSING_RESOLVE_VALUE,
  updateFallbackLocale,
  FallbackLocale,
  RuntimeInternalContext
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

export type PreCompileHandler<Message = VueMessageType> = () => {
  messages: LocaleMessages<Message>
  functions: MessageFunctions<Message>
}

/** @internal */
export type CustomBlocks<Message = VueMessageType> =
  | Array<string | LocaleMessages<Message>>
  | PreCompileHandler<Message>

/**
 * Composer Options
 *
 * @remarks
 * This is options to create composer.
 */
export interface ComposerOptions<Message = VueMessageType> {
  locale?: Locale
  fallbackLocale?: FallbackLocale
  inheritLocale?: boolean
  messages?: LocaleMessages<Message>
  datetimeFormats?: DateTimeFormatsType
  numberFormats?: NumberFormatsType
  modifiers?: LinkedModifiers<Message>
  pluralRules?: PluralizationRules
  missing?: MissingHandler
  missingWarn?: boolean | RegExp
  fallbackWarn?: boolean | RegExp
  fallbackRoot?: boolean
  fallbackFormat?: boolean
  postTranslation?: PostTranslationHandler<Message>
  warnHtmlMessage?: boolean
}

/**
 * @internal
 */
export interface ComposerInternalOptions<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  Message = VueMessageType
> {
  __i18n?: CustomBlocks<Message>
  __root?: Composer<Messages, DateTimeFormats, NumberFormats, Message>
}

/**
 * Composer Interfaces
 *
 * @remarks
 * This is the interface for being used for Vue 3 Composition API.
 */
export interface Composer<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  Message = VueMessageType
> {
  // properties
  locale: WritableComputedRef<Locale>
  fallbackLocale: WritableComputedRef<FallbackLocale>
  inheritLocale: boolean
  readonly availableLocales: Locale[]
  readonly messages: ComputedRef<Messages>
  readonly datetimeFormats: ComputedRef<DateTimeFormats>
  readonly numberFormats: ComputedRef<NumberFormats>
  readonly modifiers: LinkedModifiers<Message>
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
  tm(key: Path): LocaleMessageValue<Message> | {}
  getLocaleMessage(locale: Locale): LocaleMessageDictionary<Message>
  setLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void
  mergeLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void
  getDateTimeFormat(locale: Locale): DateTimeFormat
  setDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void
  getNumberFormat(locale: Locale): NumberFormat
  setNumberFormat(locale: Locale, format: NumberFormat): void
  mergeNumberFormat(locale: Locale, format: NumberFormat): void
  getPostTranslationHandler(): PostTranslationHandler<Message> | null
  setPostTranslationHandler(
    handler: PostTranslationHandler<Message> | null
  ): void
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

function defineRuntimeMissingHandler<Message = VueMessageType>(
  missing: MissingHandler
): RuntimeMissingHandler<Message> {
  return ((
    ctx: RuntimeCommonContext<Message>,
    locale: Locale,
    key: Path,
    type: string
  ): string | void => {
    return missing(locale, key, getCurrentInstance() || undefined, type)
  }) as RuntimeMissingHandler<Message>
}

// TODO: maybe, we need to improve type definitions
function getLocaleMessages<
  Messages extends LocaleMessages<Message>,
  DateTimeFormats extends DateTimeFormatsType,
  NumberFormats extends NumberFormatsType,
  Message = VueMessageType
>(
  options: ComposerOptions<Message> &
    ComposerInternalOptions<Messages, DateTimeFormats, NumberFormats, Message>,
  locale: Locale
): LocaleMessages<Message> {
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
    addPreCompileMessages<Message>(ret, functions as MessageFunctions<Message>)
  }

  return ret
}

export function addPreCompileMessages<Message = VueMessageType>(
  messages: LocaleMessages<Message>,
  functions: MessageFunctions<Message>
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
export function createComposer<
  Message = VueMessageType,
  Options extends ComposerOptions<Message> = object,
  Messages extends Record<
    keyof Options['messages'],
    LocaleMessageDictionary<Message>
  > = Record<keyof Options['messages'], LocaleMessageDictionary<Message>>,
  DateTimeFormats extends Record<
    keyof Options['datetimeFormats'],
    DateTimeFormat
  > = Record<keyof Options['datetimeFormats'], DateTimeFormat>,
  NumberFormats extends Record<
    keyof Options['numberFormats'],
    NumberFormat
  > = Record<keyof Options['numberFormats'], NumberFormat>
>(
  options: Options = {} as Options
): Composer<
  Options['messages'],
  Options['datetimeFormats'],
  Options['numberFormats'],
  Message
> {
  const { __root } = options as ComposerInternalOptions<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Message
  >
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

  const _messages = ref<LocaleMessages<Message>>(
    getLocaleMessages<Messages, DateTimeFormats, NumberFormats, Message>(
      options,
      _locale.value
    )
  )

  const _datetimeFormats = ref<DateTimeFormatsType>(
    isPlainObject(options.datetimeFormats)
      ? options.datetimeFormats
      : { [_locale.value]: {} }
  )

  const _numberFormats = ref<NumberFormatsType>(
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
    ? defineRuntimeMissingHandler<Message>(options.missing)
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
      : {} as LinkedModifiers<Message>

  // pluralRules
  const _pluralRules = options.pluralRules

  // runtime context
  // eslint-disable-next-line prefer-const
  let _context: RuntimeContext<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Message
  >
  function getRuntimeContext(): RuntimeContext<
    Messages,
    DateTimeFormats,
    NumberFormats,
    Message
  > {
    return createRuntimeContext<Message>({
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
      __datetimeFormatters: isPlainObject(_context)
        ? ((_context as unknown) as RuntimeInternalContext).__datetimeFormatters
        : undefined,
      __numberFormatters: isPlainObject(_context)
        ? ((_context as unknown) as RuntimeInternalContext).__numberFormatters
        : undefined
    } as RuntimeOptions<Message>) as RuntimeContext<
      Messages,
      DateTimeFormats,
      NumberFormats,
      Message
    >
  }
  _context = getRuntimeContext()
  updateFallbackLocale<Message>(_context, _locale.value, _fallbackLocale.value)

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
  const messages = computed<Messages>(() => _messages.value as Messages)

  // datetimeFormats
  const datetimeFormats = computed<DateTimeFormats>(
    () => _datetimeFormats.value as DateTimeFormats
  )

  // numberFormats
  const numberFormats = computed<NumberFormats>(
    () => _numberFormats.value as NumberFormats
  )

  /**
   * define methods
   */

  // getPostTranslationHandler
  function getPostTranslationHandler(): PostTranslationHandler<Message> | null {
    return isFunction(_postTranslation) ? _postTranslation : null
  }

  // setPostTranslationHandler
  function setPostTranslationHandler(
    handler: PostTranslationHandler<Message> | null
  ): void {
    _postTranslation = handler
    _context.postTranslation = handler
  }

  // getMissingHandler
  function getMissingHandler(): MissingHandler | null {
    return _missing
  }

  // setMissingHandler
  function setMissingHandler(handler: MissingHandler | null): void {
    if (handler !== null) {
      _runtimeMissing = defineRuntimeMissingHandler(handler)
    }
    _missing = handler
    _context.missing = _runtimeMissing
  }

  function wrapWithDeps<T, U = T>(
    fn: (context: unknown) => unknown,
    argumentParser: () => string,
    warnType: ComposerWarnType,
    fallbackSuccess: (root: Composer<T> & ComposerInternal) => U,
    fallbackFail: (key: string) => U,
    successCondition: (val: unknown) => boolean
  ): U {
    const ret = fn(getRuntimeContext()) // track reactive dependency, see the getRuntimeContext
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
        ? fallbackSuccess((__root as unknown) as Composer<T> & ComposerInternal)
        : fallbackFail(key)
    } else if (successCondition(ret)) {
      return ret as U
    } else {
      /* istanbul ignore next */
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE)
    }
  }

  // t
  function t(...args: unknown[]): string {
    return wrapWithDeps<string>(
      context =>
        translate<Messages, string>(
          context as RuntimeTranslationContext<Messages, string>,
          ...args
        ),
      () => parseTranslateArgs(...args)[0],
      'translate',
      root => root.t(...args),
      key => key,
      val => isString(val)
    )
  }

  // d
  function d(...args: unknown[]): string {
    return wrapWithDeps<string>(
      context =>
        datetime<DateTimeFormats, string>(
          context as RuntimeDateTimeContext<DateTimeFormats, string>,
          ...args
        ),
      () => parseDateTimeArgs(...args)[0],
      'datetime format',
      root => root.d(...args),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
  }

  // n
  function n(...args: unknown[]): string {
    return wrapWithDeps<string>(
      context =>
        number<NumberFormats, string>(
          context as RuntimeNumberContext<NumberFormats, string>,
          ...args
        ),
      () => parseNumberArgs(...args)[0],
      'number format',
      root => root.n(...args),
      () => MISSING_RESOLVE_VALUE,
      val => isString(val)
    )
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
    return wrapWithDeps<VNode, VNodeArrayChildren>(
      context => {
        let ret: unknown
        try {
          const _context = context as RuntimeTranslationContext<Messages, VNode>
          _context.processor = processor
          ret = translate<Messages, VNode>(_context, ...args)
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
    )
  }

  // __numberParts, using for `i18n-n` component
  function __numberParts(...args: unknown[]): string | Intl.NumberFormatPart[] {
    return wrapWithDeps<string | Intl.NumberFormatPart[]>(
      context => number(context as RuntimeContext<Messages, string>, ...args),
      () => parseNumberArgs(...args)[0],
      'number format',
      root => root.__numberParts(...args),
      () => [],
      val => isString(val) || isArray(val)
    )
  }

  // __datetimeParts, using for `i18n-d` component
  function __datetimeParts(
    ...args: unknown[]
  ): string | Intl.DateTimeFormatPart[] {
    return wrapWithDeps<string | Intl.DateTimeFormatPart[]>(
      context => datetime(context as RuntimeContext<Messages, string>, ...args),
      () => parseDateTimeArgs(...args)[0],
      'datetime format',
      root => root.__datetimeParts(...args),
      () => [],
      val => isString(val) || isArray(val)
    )
  }

  // tm
  function tm(key: Path): LocaleMessageValue<Message> | {} {
    const messages = _messages.value[_locale.value] || {}
    const target = resolveValue(messages, key)
    // prettier-ignore
    return target != null
      ? target as LocaleMessageValue<Message>
      : __root
        ? __root.tm(key) as LocaleMessageValue<Message> || {}
        : {}
  }

  // getLocaleMessage
  function getLocaleMessage(locale: Locale): LocaleMessageDictionary<Message> {
    return (_messages.value[locale] || {}) as LocaleMessageDictionary<Message>
  }

  // setLocaleMessage
  function setLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ) {
    _messages.value[locale] = message
    _context.messages = _messages.value as typeof _context.messages
  }

  // mergeLocaleMessage
  function mergeLocaleMessage(
    locale: Locale,
    message: LocaleMessageDictionary<Message>
  ): void {
    _messages.value[locale] = Object.assign(
      _messages.value[locale] || {},
      message
    )
    _context.messages = _messages.value as typeof _context.messages
  }

  // getDateTimeFormat
  function getDateTimeFormat(locale: Locale): DateTimeFormat {
    return _datetimeFormats.value[locale] || {}
  }

  // setDateTimeFormat
  function setDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = format
    _context.datetimeFormats = _datetimeFormats.value as typeof _context.datetimeFormats
    clearDateTimeFormat<DateTimeFormats, Message>(_context, locale, format)
  }

  // mergeDateTimeFormat
  function mergeDateTimeFormat(locale: Locale, format: DateTimeFormat): void {
    _datetimeFormats.value[locale] = Object.assign(
      _datetimeFormats.value[locale] || {},
      format
    )
    _context.datetimeFormats = _datetimeFormats.value as typeof _context.datetimeFormats
    clearDateTimeFormat<DateTimeFormats, Message>(_context, locale, format)
  }

  // getNumberFormat
  function getNumberFormat(locale: Locale): NumberFormat {
    return _numberFormats.value[locale] || {}
  }

  // setNumberFormat
  function setNumberFormat(locale: Locale, format: NumberFormat): void {
    _numberFormats.value[locale] = format
    _context.numberFormats = _numberFormats.value as typeof _context.numberFormats
    clearNumberFormat<NumberFormats, Message>(_context, locale, format)
  }

  // mergeNumberFormat
  function mergeNumberFormat(locale: Locale, format: NumberFormat): void {
    _numberFormats.value[locale] = Object.assign(
      _numberFormats.value[locale] || {},
      format
    )
    _context.numberFormats = _numberFormats.value as typeof _context.numberFormats
    clearNumberFormat<NumberFormats, Message>(_context, locale, format)
  }

  // for debug
  composerID++

  // watch root locale & fallbackLocale
  if (__root) {
    watch(__root.locale, (val: Locale) => {
      if (_inheritLocale) {
        _locale.value = val
        _context.locale = val
        updateFallbackLocale<Message>(
          _context,
          _locale.value,
          _fallbackLocale.value
        )
      }
    })
    watch(__root.fallbackLocale, (val: FallbackLocale) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val
        _context.fallbackLocale = val
        updateFallbackLocale<Message>(
          _context,
          _locale.value,
          _fallbackLocale.value
        )
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
        updateFallbackLocale<Message>(
          _context,
          _locale.value,
          _fallbackLocale.value
        )
      }
    },
    get availableLocales(): Locale[] {
      return Object.keys(_messages.value).sort()
    },
    messages,
    datetimeFormats,
    numberFormats,
    get modifiers(): LinkedModifiers<Message> {
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
    tm,
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
