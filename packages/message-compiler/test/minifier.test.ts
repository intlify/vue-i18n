import { format } from '@intlify/shared'
import { createParser } from '../src/parser'
import { optimize } from '../src/optimizer'
import { minify } from '../src/minifier'
import { CompileErrorCodes, errorMessages } from '../src/errors'

import type { MessageNode, PluralNode, ResourceNode } from '../src/nodes'

test('minify', () => {
  const parser = createParser({ location: false })
  const msg = `no apples | {0} apple | {n} apples`
  const ast = optimize(parser.parse(msg))
  minify(ast)

  expect(ast).toMatchSnapshot()
  const messages = (ast.b! as PluralNode)
    .c!.map(node => (node as MessageNode).s)
    .filter(Boolean)
  expect(messages).toEqual(['no apples'])
})

test('unhandle error', () => {
  // wrong node type
  const type = 1024
  const ast = {
    type
  } as unknown as ResourceNode
  expect(() => minify(ast)).toThrowError(
    format(errorMessages[CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE], type)
  )
})
