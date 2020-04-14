import {
  isNumber,
  isFunction,
  toDisplayString,
  isObject,
  isString,
  isPlainObject
} from '../utils'

export type PluralizationRule = (
  choice: number,
  choicesLength: number,
  orgRule?: PluralizationRule
) => number

export type PluralizationRules = { [locale: string]: PluralizationRule }
export type LinkedModify = (value: unknown, type: string) => unknown
export type LinkedModifiers = { [key: string]: LinkedModify }
export type MessageFunction = (ctx: MessageContext) => unknown
export type MessageFucntions = { [key: string]: MessageFunction }
export type MessageResolveFunction = (key: string) => MessageFunction
export type NamedValue<T = {}> = T & { [prop: string]: unknown }
export type MessageNormalize = (values: unknown[]) => unknown
export type MessageInterpolate = (val: unknown) => unknown

export interface MessageProcessor {
  type?: string
  interpolate?: MessageInterpolate
  normalize?: MessageNormalize
}

export type MessageContextOptions<N = {}> = {
  parent?: MessageContext
  locale?: string
  list?: unknown[]
  named?: NamedValue<N>
  modifiers?: LinkedModifiers
  pluralIndex?: number
  pluralRules?: PluralizationRules
  messages?: MessageFucntions | MessageResolveFunction // TODO: need to design resolve message function?
  processor?: MessageProcessor
}

export type MessageContext = {
  list: (index: number) => unknown
  named: (key: string) => unknown
  pluralIndex: number
  pluralRule: PluralizationRule
  orgPluralRule?: PluralizationRule
  modifier: (name: string) => LinkedModify
  message: (name: string) => MessageFunction
  type: string
  interpolate: MessageInterpolate
  normalize: MessageNormalize
}

const DEFAULT_MODIFIER = (str: unknown): unknown => str
const DEFAULT_MESSAGE = (ctx: MessageContext): unknown => '' // eslint-disable-line
export const DEFAULT_MESSAGE_DATA_TYPE = 'text'
const DEFAULT_NORMALIZE = (values: unknown[]): unknown =>
  values.length === 0 ? values[0] : values.join('')
const DEFAULT_INTERPOLATE = toDisplayString

function pluralDefault(choice: number, choicesLength: number): number {
  choice = Math.abs(choice)
  if (choicesLength === 2) {
    // prettier-ignore
    return choice
      ? choice > 1
        ? 1
        : 0
      : 1
  }
  return choice ? Math.min(choice, 2) : 0
}

function getPluralIndex(options: MessageContextOptions): number {
  // prettier-ignore
  const index = isNumber(options.pluralIndex)
    ? options.pluralIndex
    : -1
  // prettier-ignore
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n))
    ? isNumber(options.named.count)
      ? options.named.count
      : isNumber(options.named.n)
        ? options.named.n
        : index
    : index
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNamed(pluralIndex: number, named: any): void {
  if (!named.count) {
    named.count = pluralIndex
  }
  if (!named.n) {
    named.n = pluralIndex
  }
}

export function createMessageContext<N = {}>(
  options: MessageContextOptions<N> = {}
): MessageContext {
  const locale = options.locale
  // TODO: should be implemented warning message
  const pluralIndex = getPluralIndex(options)

  // TODO: should be implemented warning message
  const pluralRule =
    isObject(options.pluralRules) &&
    isString(locale) &&
    isFunction(options.pluralRules[locale])
      ? options.pluralRules[locale]
      : pluralDefault
  const orgPluralRule =
    isObject(options.pluralRules) &&
    isString(locale) &&
    isFunction(options.pluralRules[locale])
      ? pluralDefault
      : undefined

  const _list = options.list || []
  // TODO: should be implemented warning message
  const list = (index: number): unknown => _list[index]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _named = options.named || ({} as any)
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named)
  // TODO: should be implemented warning message
  const named = (key: string): unknown => _named[key]

  // TODO: should be implemented warning message
  const modifier = (name: string): LinkedModify =>
    options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER

  const message = (name: string): MessageFunction => {
    // TODO: need to design resolve message function?
    // prettier-ignore
    const msg = isFunction(options.messages)
      ? options.messages(name)
      : isObject(options.messages)
        ? options.messages[name]
        : false
    return !msg
      ? options.parent
        ? options.parent.message(name) // resolve from parent messages
        : DEFAULT_MESSAGE
      : msg
  }

  const type =
    isPlainObject(options.processor) && isString(options.processor.type)
      ? options.processor.type
      : DEFAULT_MESSAGE_DATA_TYPE

  const normalize =
    isPlainObject(options.processor) && isFunction(options.processor.normalize)
      ? options.processor.normalize
      : DEFAULT_NORMALIZE

  const interpolate =
    isPlainObject(options.processor) &&
    isFunction(options.processor.interpolate)
      ? options.processor.interpolate
      : DEFAULT_INTERPOLATE

  return {
    list,
    named,
    pluralIndex,
    pluralRule,
    orgPluralRule,
    modifier,
    message,
    type,
    interpolate,
    normalize
  }
}
