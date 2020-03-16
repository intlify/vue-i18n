/**
 * Runtime
 *
 * Runtime is low-level API for i18n
 * This module is offered core i18n feature of Intlify project
 */

import { compile, MessageFunction } from './message/compiler'
import { createMessageContext, LinkedModifiers, MessageContextOptions, MessageResolveFunction } from './context'
import { Path, resolveValue } from './path'
import { isObject, isString, isNumber, isFunction } from './utils'

export type Locale = string
export type LocaleMessageDictionary = {
  [property: string]: LocaleMessage
}
export type LocaleMessage =
  | string
  | MessageFunction
  | LocaleMessageDictionary
  | LocaleMessage[]

export type LocaleMessages = Record<Locale, LocaleMessage>
export type TranslateResult = string

// TODO: should implement more runtime !!
export type RuntimeOptions = {
  locale?: Locale
  fallbackLocales?: Locale[]
  messages?: LocaleMessages
  modifiers?: LinkedModifiers
  preCompile?: false // TODO: we need this option?
  // ...
}

export type RuntimeContext = {
  locale: Locale
  fallbackLocales: Locale[]
  messages: LocaleMessages
  modifiers: LinkedModifiers
  compileCache: Record<string, MessageFunction>
}

const DEFAULT_LINKDED_MODIFIERS: LinkedModifiers = {
  upper: (str: string): string => str.toUpperCase(),
  lower: (str: string): string => str.toLowerCase(),
  capitalize: (str: string): string => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`
}

const NOOP_MESSAGE_FUNCTION = () => ''

export function createRuntimeContext (options: RuntimeOptions = {}): RuntimeContext {
  const locale = options.locale || 'en-US'
  const fallbackLocales = options.fallbackLocales || [locale]
  const messages = options.messages || { [locale]: {} }
  const compileCache: Record<string, MessageFunction> = Object.create(null)
  const modifiers = Object.assign({} as LinkedModifiers, options.modifiers || {}, DEFAULT_LINKDED_MODIFIERS)

  return {
    locale,
    fallbackLocales,
    messages,
    modifiers,
    compileCache
  }
}

/*
 * localize
 *
 * use cases
 *    'foo.bar' path -> 'hi {0} !' or 'hi {name} !'
 *
 *    // no argument, context & path only
 *    localize(context, 'foo.bar')
 *
 *    // list argument
 *    localize(context, 'foo.bar', ['kazupon'])
 *    localize(context, 'foo.bar', { list: ['kazupon'] })
 *
 *    // named argument
 *    localize(context, 'foo.bar', { named: { name: 'kazupon' } })
 *
 *    // plural choice number
 *    localize(context, 'foo.bar', 2)
 *    localize(context, 'foo.bar', { plural: 2 })
 *
 *    // plural choice number with name argument
 *    localize(context, 'foo.bar', { named: { name: 'kazupon' } }, 2)
 *    localize(context, 'foo.bar', { named: { name: 'kazupon' }, plural: 2 })
 *
 *    // default message argument
 *    localize(context, 'foo.bar', 'this is default message')
 *    localize(context, 'foo.bar', { default: 'this is default message' })
 *
 *    // default message with named argument
 *    localize(context, 'foo.bar', { named: { name; 'kazupon' } }, 'Hello {name} !')
 *    localize(context, 'foo.bar', { named: { name: 'kazupon' }, default: 'Hello {name} !' })
 *
 *    // use key as default message
 *    localize(context, 'hi {0} !', { list: ['kazupon'] }, true)
 *    localize(context, 'hi {0} !', { list: ['kazupon'], default: true })
 *
 *    // locale
 *    localize(context, 'foo.bar', { locale: 'ja' })
 *
 *    // missing warning option
 *    localize(context, 'foo.bar', { missing: true })
 */

export function localize (context: RuntimeContext, key: Path, ...args: unknown[]): string {
  const { locale, messages, compileCache, modifiers } = context

  const message = messages[locale]
  if (!isObject(message)) {
    // TODO: should be more designed default
    return key
  }

  const value = resolveValue(message, key)
  if (!isString(value)) {
    // TODO: should be more designed default
    return key
  }

  // TODO: need to design resolve message function?
  const resolveMessage: MessageResolveFunction = (key: string): MessageFunction => {
    const fn = compileCache[key]
    if (fn) { return fn }
    const val = resolveValue(message, key)
    if (isString(val)) {
      return (compileCache[val] = compile(val))
    } else if (isFunction(val)) {
      return val as MessageFunction
    } else {
      // TODO: should be implemented warning message
      return NOOP_MESSAGE_FUNCTION
    }
  }

  const options: MessageContextOptions = {
    modifiers,
    messages: resolveMessage
  }

  if (isObject(args[0])) {
    const obj = args[0] as Record<any, any>
    if (obj.list) {
      options.list = obj.list
    }
    if (obj.named) {
      options.named = obj.named
    }
    if (isNumber(obj.plural)) {
      options.pluralIndex = obj.plural
    }
  }

  const msg = compileCache[value] || (compileCache[value] = compile(value))
  const msgContext = createMessageContext(options)
  return msg(msgContext)
}
