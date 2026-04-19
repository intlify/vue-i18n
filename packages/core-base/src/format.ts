import { NodeTypes } from '@intlify/message-compiler'
import { hasOwn, isNumber, isArray } from '@intlify/shared'
import {
  createUnhandleNodeError,
  resolveBody,
  resolveCases,
  resolveItems,
  resolveLinkedKey,
  resolveLinkedModifier,
  resolveStatic,
  resolveType,
  resolveValue
} from './ast'

import type {
  LinkedNode,
  ListNode,
  MessageNode,
  NamedNode,
  Node,
  PluralNode,
  ResourceNode
} from '@intlify/message-compiler'
import type { MessageContext, MessageFunction, MessageFunctionReturn, MessageType } from './runtime'

export function format<Message = string>(ast: ResourceNode): MessageFunction<Message> {
  return (ctx: MessageContext<Message>): MessageFunctionReturn<Message> =>
    formatParts<Message>(ctx, ast)
}

export function formatParts<Message = string>(
  ctx: MessageContext<Message>,
  ast: ResourceNode
): MessageFunctionReturn<Message> {
  const body = resolveBody(ast)
  if (body == null) {
    throw createUnhandleNodeError(NodeTypes.Resource)
  }
  const type = resolveType(body)
  if (type === NodeTypes.Plural) {
    const plural = body as PluralNode
    const cases = resolveCases(plural)
    return ctx.plural(
      cases.reduce(
        (messages, c) =>
          [
            ...((isArray(messages) ? messages : [messages]) as Array<
              MessageFunctionReturn<Message>
            >),
            formatMessageParts(ctx, c)
          ] as MessageFunctionReturn<Message>,
        [] as MessageFunctionReturn<Message>
      ) as Message[]
    ) as MessageFunctionReturn<Message>
  } else {
    return formatMessageParts(ctx, body as MessageNode)
  }
}

export function formatMessageParts<Message = string>(
  ctx: MessageContext<Message>,
  node: MessageNode
): MessageFunctionReturn<Message> {
  const static_ = resolveStatic(node)
  if (static_ != null) {
    return ctx.type === 'text'
      ? (static_ as MessageFunctionReturn<Message>)
      : ctx.normalize([static_] as MessageType<Message>[])
  } else {
    const messages = resolveItems(node).reduce(
      (acm, c) => [...acm, formatMessagePart(ctx, c)],
      [] as MessageType<Message>[]
    )
    return ctx.normalize(messages) as MessageFunctionReturn<Message>
  }
}

type NodeValue<Message> = {
  v?: MessageType<Message>
  value?: MessageType<Message>
}

export function formatMessagePart<Message = string>(
  ctx: MessageContext<Message>,
  node: Node
): MessageType<Message> {
  const type = resolveType(node)
  switch (type) {
    case NodeTypes.Text: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    case NodeTypes.Literal: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    case NodeTypes.Named: {
      const named = node as NamedNode
      if (hasOwn(named, 'k') && named.k) {
        return ctx.interpolate(ctx.named(named.k))
      }
      if (hasOwn(named, 'key') && named.key) {
        return ctx.interpolate(ctx.named(named.key))
      }
      throw createUnhandleNodeError(type)
    }
    case NodeTypes.List: {
      const list = node as ListNode
      if (hasOwn(list, 'i') && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i))
      }
      if (hasOwn(list, 'index') && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index))
      }
      throw createUnhandleNodeError(type)
    }
    case NodeTypes.Linked: {
      const linked = node as LinkedNode
      const modifier = resolveLinkedModifier(linked)
      const key = resolveLinkedKey(linked)
      return ctx.linked(
        formatMessagePart(ctx, key!) as string,
        modifier ? (formatMessagePart(ctx, modifier) as string) : undefined,
        ctx.type
      )
    }
    case NodeTypes.LinkedKey: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    case NodeTypes.LinkedModifier: {
      return resolveValue<Message>(node as NodeValue<Message>, type)
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`)
  }
}
