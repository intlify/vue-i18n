import { ResourceNode, Node, NodeTypes, PluralNode, MessageNode, LinkedNode, LinkedModitierNode, LinkedKeyNode } from './parser'

// TODO: if we offer custom transform for uses, should be defined TransformOptions type to here
// ex.
// type TransformOptions = {
// }

type TransformContext = {
  ast: ResourceNode
  modifiers: Set<string>
  refers: Set<string>
  needInterpolate: boolean
}

type Transformer = Readonly<{
  context: () => TransformContext
}>

function createTransformer (ast: ResourceNode/*, options: TransformOptions */): Transformer {
  const _context = {
    ast,
    modifiers: new Set(),
    refers: new Set(),
    needInterpolate: false
  } as TransformContext

  const context = (): TransformContext => _context

  return Object.freeze({
    context
  })
}

function traverseNodes (nodes: Node[], transformer: Transformer): void {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer)
  }
}

function traverseNode (node: Node, transformer: Transformer): void {
  const context = transformer.context()

  // TODO: if we need pre-hook of transform, should be implemeted to here

  switch (node.type) {
    case NodeTypes.Plural:
      traverseNodes((node as PluralNode).cases, transformer)
      break
    case NodeTypes.Message:
      traverseNodes((node as MessageNode).items, transformer)
      break
    case NodeTypes.Linked:
      const linked = node as LinkedNode
      linked.modifier && traverseNode(linked.modifier, transformer)
      traverseNode(linked.key, transformer)
      break
    case NodeTypes.LinkedModifier:
      const modifier = node as LinkedModitierNode
      context.modifiers.add(modifier.value)
      break
    case NodeTypes.LinkedKey:
      const key = node as LinkedKeyNode
      context.refers.add(key.value)
      break
    case NodeTypes.List:
    case NodeTypes.Named:
      context.needInterpolate = true
      break
    default:
      // TODO:
      break
  }

  // TODO: if we need post-hook of transform, should be implemeted to here
}

// transform AST
export function transform (ast: ResourceNode/*, options: TransformOptions */): void {
  const transformer = createTransformer(ast)
  // traverse
  ast.body && traverseNode(ast.body, transformer)
  // set meta information
  const context = transformer.context()
  ast.modifiers = [...context.modifiers]
  ast.refers = [...context.refers]
  ast.needInterpolate = context.needInterpolate
}
