import { CompileErrorCodes, createCompileError } from './errors'
import { NodeTypes } from './nodes'

import type {
  LinkedKeyNode,
  LinkedModifierNode,
  LinkedNode,
  ListNode,
  LiteralNode,
  MessageNode,
  NamedNode,
  Node,
  PluralNode,
  ResourceNode,
  TextNode
} from './nodes'

const ERROR_DOMAIN = 'minifier'

export function mangle(node: Node): void {
  node.t = node.type

  switch (node.type) {
    case NodeTypes.Resource: {
      const resource = node as ResourceNode
      mangle(resource.body)
      resource.b = resource.body
      delete (resource as Partial<ResourceNode>).body
      break
    }
    case NodeTypes.Plural: {
      const plural = node as PluralNode
      const cases = plural.cases
      for (let i = 0; i < cases.length; i++) {
        mangle(cases[i])
      }
      plural.c = cases
      delete (plural as Partial<PluralNode>).cases
      break
    }
    case NodeTypes.Message: {
      const message = node as MessageNode
      const items = message.items
      for (let i = 0; i < items.length; i++) {
        mangle(items[i])
      }
      message.i = items
      delete (message as Partial<MessageNode>).items
      if (message.static) {
        message.s = message.static
        delete message.static
      }
      break
    }
    case NodeTypes.Text:
    case NodeTypes.Literal:
    case NodeTypes.LinkedModifier:
    case NodeTypes.LinkedKey: {
      const valueNode = node as TextNode | LiteralNode | LinkedKeyNode | LinkedModifierNode
      if (valueNode.value) {
        valueNode.v = valueNode.value
        delete valueNode.value
      }
      break
    }
    case NodeTypes.Linked: {
      const linked = node as LinkedNode
      mangle(linked.key)
      linked.k = linked.key
      delete (linked as Partial<LinkedNode>).key
      if (linked.modifier) {
        mangle(linked.modifier)
        linked.m = linked.modifier
        delete linked.modifier
      }
      break
    }
    case NodeTypes.List: {
      const list = node as ListNode
      list.i = list.index
      delete (list as Partial<ListNode>).index
      break
    }
    case NodeTypes.Named: {
      const named = node as NamedNode
      named.k = named.key
      delete (named as Partial<NamedNode>).key
      break
    }
    default:
      if (__DEV__) {
        throw createCompileError(CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE, null, {
          domain: ERROR_DOMAIN,
          args: [node.type]
        })
      }
  }

  delete (node as Partial<Node>).type
}
