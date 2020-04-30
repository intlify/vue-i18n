import {
  ResourceNode,
  Node,
  NodeTypes,
  PluralNode,
  MessageNode,
  LinkedNode
} from './parser'
import { TransformOptions } from './options'
import { HelperNameMap } from './runtime'

// TODO: if we offer custom transform for uses, should be defined TransformOptions type to here
// ex.
// type TransformOptions = {
// }

type TransformContext = {
  ast: ResourceNode
  helpers: Set<string>
}

type Transformer = Readonly<{
  context: () => TransformContext
  helper: (name: string) => string
}>

function createTransformer(
  ast: ResourceNode /*, options: TransformOptions */
): Transformer {
  const _context = {
    ast,
    helpers: new Set()
  } as TransformContext

  const context = (): TransformContext => _context
  const helper = (name: string): string => {
    _context.helpers.add(name)
    return name
  }

  return { context, helper }
}

function traverseNodes(nodes: Node[], transformer: Transformer): void {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer)
  }
}

function traverseNode(node: Node, transformer: Transformer): void {
  // TODO: if we need pre-hook of transform, should be implemeted to here

  switch (node.type) {
    case NodeTypes.Plural:
      traverseNodes((node as PluralNode).cases, transformer)
      transformer.helper(HelperNameMap.PLURAL_INDEX)
      transformer.helper(HelperNameMap.PLURAL_RULE)
      transformer.helper(HelperNameMap.ORG_PLURAL_RULE)
      break
    case NodeTypes.Message:
      traverseNodes((node as MessageNode).items, transformer)
      break
    case NodeTypes.Linked:
      const linked = node as LinkedNode
      if (linked.modifier) {
        traverseNode(linked.modifier, transformer)
        transformer.helper(HelperNameMap.MODIFIER)
        transformer.helper(HelperNameMap.TYPE)
      }
      traverseNode(linked.key, transformer)
      transformer.helper(HelperNameMap.MESSAGE)
      break
    case NodeTypes.List:
      transformer.helper(HelperNameMap.INTERPOLATE)
      transformer.helper(HelperNameMap.LIST)
      break
    case NodeTypes.Named:
      transformer.helper(HelperNameMap.INTERPOLATE)
      transformer.helper(HelperNameMap.NAMED)
      break
    default:
      // TODO:
      break
  }

  // TODO: if we need post-hook of transform, should be implemeted to here
}

// transform AST
export function transform(
  ast: ResourceNode,
  options: TransformOptions = {} // eslint-disable-line
): void {
  const transformer = createTransformer(ast)
  transformer.helper(HelperNameMap.NORMALIZE)

  // traverse
  ast.body && traverseNode(ast.body, transformer)

  // set meta information
  const context = transformer.context()
  ast.helpers = [...context.helpers]
}
