import { toDisplayString } from './utils'

export type PluralizationRule = (choice: number, choicesLength: number) => number
export type LinkedModify = (str: string) => string
export type LinkedModifiers = { [key: string]: LinkedModify }
export type MessageFunction = (ctx: MessageContext) => string
export type MessageFucntions = { [key: string]: MessageFunction }
export type NamedValue<T = {}> = T & { [prop: string]: unknown }

export type MessageContextOptions<N = {}> = {
  parent?: MessageContext
  list?: unknown[]
  named?: NamedValue<N>
  modifiers?: LinkedModifiers
  pluralIndex?: number
  pluralRule?: PluralizationRule
  messages?: MessageFucntions
}

export type MessageContext = {
  list: (index: number) => unknown
  named: (key: string) => unknown
  pluralIndex: number
  pluralRule: PluralizationRule
  modifier: (name: string) => LinkedModify
  message: (name: string) => MessageFunction
  interpolate: (val: unknown) => string
}

const DEFAULT_MODIFIER = (str: string): string => str
const DEFAULT_MESSAGE = (ctx: MessageContext): string => '' // eslint-disable-line

function pluralDefault (choice: number, choicesLength: number): number {
  choice = Math.abs(choice)
  if (choicesLength === 2) {
    return choice
      ? choice > 1
        ? 1
        : 0
      : 1
  }
  return choice ? Math.min(choice, 2) : 0
}

export function createMessageContext<N = {}> (
  options: MessageContextOptions<N> = {}
): MessageContext {
  // TODO: should be remove any ...
  const list = (index: number): unknown => (options.list || [])[index]

  // TODO: should be remove any ...
  const named = (key: string): unknown => (options.named || {} as any)[key]

  // TODO: should be implemented warning message
  const pluralIndex = options.pluralIndex || -1

  // TODO: should be implemented warning message
  const pluralRule = options.pluralRule || pluralDefault

  // TODO: should be implemented warning message
  const modifier = (name: string): LinkedModify => options.modifiers
    ? options.modifiers[name]
    : DEFAULT_MODIFIER

  const message = (name: string): MessageFunction => {
    const msg = options.messages !== undefined && options.messages[name]
    return !msg
      ? options.parent
        ? options.parent.message(name) // resolve from parent messages
        : DEFAULT_MESSAGE
      : msg
  }

  return {
    list,
    named,
    pluralIndex,
    pluralRule,
    modifier,
    message,
    interpolate: toDisplayString
  }
}
