import { NodeTypes } from '@intlify/message-compiler'

import type { MessageNode, ResourceNode } from '@intlify/message-compiler'
import type { MessageContext, MessageFunction, MessageType } from './runtime'

export function format<Message = string>(
  ast: ResourceNode
): MessageFunction<Message> {
  const msg = (ctx: MessageContext<Message>): MessageType<Message> => {
    return null as any
  }
  // TODO: add meta data for vue-devtools debugging, such as `key`, `source` and `locale`
  return msg
}
