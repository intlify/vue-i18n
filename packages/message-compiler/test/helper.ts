import { NodeTypes } from '../src/nodes'

import type { LinkedNode, MessageNode, Node, PluralNode } from '../src/nodes'

export function traverse(node: Node, fn: (node: Node) => void): void {
  fn(node)
  if (node.type === NodeTypes.Plural) {
    ;(node as PluralNode).cases.forEach(c => traverse(c, fn))
  } else if (node.type === NodeTypes.Message) {
    ;(node as MessageNode).items.forEach(c => traverse(c, fn))
  } else if (node.type === NodeTypes.Linked) {
    traverse((node as LinkedNode).key, fn)
  }
}
