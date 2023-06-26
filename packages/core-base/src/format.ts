import { NodeTypes } from '@intlify/message-compiler'

import type {
  Node,
  TextNode,
  LiteralNode,
  ListNode,
  MessageNode,
  NamedNode,
  LinkedNode,
  LinkedKeyNode,
  LinkedModifierNode,
  ResourceNode
} from '@intlify/message-compiler'
import type {
  MessageContext,
  MessageFunction,
  MessageType,
  MessageFunctionReturn
} from './runtime'

export function format<Message = string>(
  ast: ResourceNode
): MessageFunction<Message> {
  const msg = (ctx: MessageContext<Message>): MessageFunctionReturn<Message> =>
    formatParts<Message>(ctx, ast)
  // TODO: add meta data for vue-devtools debugging, such as `key`, `source` and `locale`
  // TODO: optimization for static text message
  return msg
}

function formatParts<Message = string>(
  ctx: MessageContext<Message>,
  ast: ResourceNode
): MessageFunctionReturn<Message> {
  if (ast.body.type === NodeTypes.Plural) {
    return ctx.plural(
      ast.body.cases.reduce(
        (messages, c) =>
          [
            ...messages,
            formatMessageParts(ctx, c)
          ] as MessageFunctionReturn<Message>,
        [] as MessageFunctionReturn<Message>
      ) as Message[]
    ) as MessageFunctionReturn<Message>
  } else {
    return formatMessageParts(ctx, ast.body)
  }
}

function formatMessageParts<Message = string>(
  ctx: MessageContext<Message>,
  node: MessageNode
): MessageFunctionReturn<Message> {
  const messages = node.items.reduce(
    (acm, c) => [...acm, formatMessagePart(ctx, c)],
    [] as MessageType<Message>[]
  )
  return ctx.normalize(messages) as MessageFunctionReturn<Message>
}

function formatMessagePart<Message = string>(
  ctx: MessageContext<Message>,
  node: Node
): MessageType<Message> {
  switch (node.type) {
    case NodeTypes.Text:
      return (node as TextNode).value as MessageType<Message>
    case NodeTypes.Literal:
      return (node as LiteralNode).value as MessageType<Message>
    case NodeTypes.Named:
      return ctx.interpolate(ctx.named((node as NamedNode).key))
    case NodeTypes.List:
      return ctx.interpolate(ctx.list((node as ListNode).index))
    case NodeTypes.Linked:
      return ctx.linked(
        formatMessagePart(ctx, (node as LinkedNode).key) as string,
        (node as LinkedNode).modifier
          ? (formatMessagePart(ctx, (node as LinkedNode).modifier!) as string)
          : undefined,
        ctx.type
      )
    case NodeTypes.LinkedKey:
      return (node as LinkedKeyNode).value as MessageType<Message>
    case NodeTypes.LinkedModifier:
      return (node as LinkedModifierNode).value as MessageType<Message>
    default:
      throw new Error(
        `unhandled node type on format message part: ${node.type}`
      )
  }
}
