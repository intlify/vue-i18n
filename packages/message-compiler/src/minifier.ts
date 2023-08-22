import { NodeTypes } from './nodes'
import { createCompileError, CompileErrorCodes } from './errors'

import type {
  MessageNode,
  ResourceNode,
  Node,
  PluralNode,
  TextNode,
  LiteralNode,
  LinkedNode,
  LinkedKeyNode,
  LinkedModifierNode,
  ListNode,
  NamedNode
} from './nodes'

export const ERROR_DOMAIN = 'minifier'

/* eslint-disable @typescript-eslint/no-explicit-any */

export function minify(node: Node) {
  node.t = node.type

  switch (node.type) {
    case NodeTypes.Resource:
      const resource = node as ResourceNode
      minify(resource.body)
      resource.b = resource.body
      delete (resource as any).body
      break
    case NodeTypes.Plural:
      const plural = node as PluralNode
      const cases = plural.cases
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i])
      }
      plural.c = cases
      delete (plural as any).cases
      break
    case NodeTypes.Message:
      const message = node as MessageNode
      const items = message.items
      for (let i = 0; i < items.length; i++) {
        minify(items[i])
      }
      message.i = items
      delete (message as any).items
      if (message.static) {
        message.s = message.static
        delete (message as any).static
      }
      break
    case NodeTypes.Text:
    case NodeTypes.Literal:
    case NodeTypes.LinkedModifier:
    case NodeTypes.LinkedKey:
      const valueNode = node as
        | TextNode
        | LiteralNode
        | LinkedKeyNode
        | LinkedModifierNode
      if (valueNode.value) {
        valueNode.v = valueNode.value
        delete (valueNode as any).value
      }
      break
    case NodeTypes.Linked:
      const linked = node as LinkedNode
      minify(linked.key)
      linked.k = linked.key
      delete (linked as any).key
      if (linked.modifier) {
        minify(linked.modifier)
        linked.m = linked.modifier
        delete (linked as any).modifier
      }
      break
    case NodeTypes.List:
      const list = node as ListNode
      list.i = list.index
      delete (list as any).index
      break
    case NodeTypes.Named:
      const named = node as NamedNode
      named.k = named.key
      delete (named as any).key
      break
    default:
      if (__DEV__) {
        throw createCompileError(
          CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE,
          null,
          {
            domain: ERROR_DOMAIN,
            args: [node.type]
          }
        )
      }
  }

  delete (node as any).type
}

/* eslint-enable @typescript-eslint/no-explicit-any */
