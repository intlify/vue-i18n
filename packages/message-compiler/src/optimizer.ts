import { NodeTypes } from './nodes'
import { join } from '@intlify/shared'

import type { MessageNode, ResourceNode } from './nodes'

export function optimize(ast: ResourceNode): ResourceNode {
  const body = ast.body
  if (body.type === NodeTypes.Message) {
    optimizeMessageNode(body)
  } else {
    body.cases.forEach(c => optimizeMessageNode(c))
  }
  return ast
}

function optimizeMessageNode(message: MessageNode) {
  if (message.items.length === 1) {
    const item = message.items[0]
    if (item.type === NodeTypes.Text || item.type === NodeTypes.Literal) {
      message.static = item.value
      delete item.value // optimization for size
    }
  } else {
    const values: string[] = []
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i]
      if (!(item.type === NodeTypes.Text || item.type === NodeTypes.Literal)) {
        break
      }
      if (item.value == null) {
        break
      }
      values.push(item.value)
    }
    if (values.length === message.items.length) {
      message.static = join(values)
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i]
        if (item.type === NodeTypes.Text || item.type === NodeTypes.Literal) {
          delete item.value // optimization for size
        }
      }
    }
  }
}
