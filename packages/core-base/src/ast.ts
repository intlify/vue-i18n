import { NodeTypes } from '@intlify/message-compiler'
import { hasOwn, isObject } from '@intlify/shared'

import type {
  LinkedModifierNode,
  LinkedNode,
  MessageNode,
  Node,
  PluralNode,
  ResourceNode
} from '@intlify/message-compiler'
import type { MessageType } from './runtime'

export function isMessageAST(val: unknown): val is ResourceNode {
  return (
    isObject(val) && resolveType(val as Node) === 0 && (hasOwn(val, 'b') || hasOwn(val, 'body'))
  )
}

const PROPS_BODY = ['b', 'body']

export function resolveBody(node: ResourceNode): ReturnType<typeof resolveProps> {
  return resolveProps<MessageNode | PluralNode>(node, PROPS_BODY)
}

const PROPS_CASES = ['c', 'cases']

export function resolveCases(node: PluralNode): ReturnType<typeof resolveProps> {
  return resolveProps<PluralNode['cases'], PluralNode['cases']>(node, PROPS_CASES, [])
}

const PROPS_STATIC = ['s', 'static']

export function resolveStatic(node: MessageNode): ReturnType<typeof resolveProps> {
  return resolveProps(node, PROPS_STATIC)
}

const PROPS_ITEMS = ['i', 'items']

export function resolveItems(node: MessageNode): ReturnType<typeof resolveProps> {
  return resolveProps<MessageNode['items'], MessageNode['items']>(node, PROPS_ITEMS, [])
}

const PROPS_TYPE = ['t', 'type']

export function resolveType(node: Node): ReturnType<typeof resolveProps> {
  return resolveProps<NodeTypes>(node, PROPS_TYPE)
}

const PROPS_VALUE = ['v', 'value']

export function resolveValue<Message = string>(
  node: { v?: MessageType<Message>; value?: MessageType<Message> },
  type: NodeTypes
): MessageType<Message> {
  const resolved = resolveProps<Message>(node as Node, PROPS_VALUE) as MessageType<Message>
  if (resolved != null) {
    return resolved
  } else {
    throw createUnhandleNodeError(type)
  }
}

const PROPS_MODIFIER = ['m', 'modifier']

export function resolveLinkedModifier(node: LinkedNode): ReturnType<typeof resolveProps> {
  return resolveProps<LinkedModifierNode>(node, PROPS_MODIFIER)
}

const PROPS_KEY = ['k', 'key']

export function resolveLinkedKey(node: LinkedNode): ReturnType<typeof resolveProps> {
  const resolved = resolveProps<LinkedNode['key']>(node, PROPS_KEY)
  if (resolved) {
    return resolved
  } else {
    throw createUnhandleNodeError(NodeTypes.Linked)
  }
}

export function resolveProps<T = string, Default = undefined>(
  node: Node,
  props: string[],
  defaultValue?: Default
): T | Default {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (hasOwn(node, prop) && (node as any)[prop] != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (node as any)[prop] as T
    }
  }
  return defaultValue as Default
}

export const AST_NODE_PROPS_KEYS: string[] = [
  ...PROPS_BODY,
  ...PROPS_CASES,
  ...PROPS_STATIC,
  ...PROPS_ITEMS,
  ...PROPS_KEY,
  ...PROPS_MODIFIER,
  ...PROPS_VALUE,
  ...PROPS_TYPE
]

export function createUnhandleNodeError(type: NodeTypes): Error {
  return new Error(`unhandled node type: ${type}`)
}
