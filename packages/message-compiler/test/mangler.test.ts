import { format } from '@intlify/shared'
import { CompileErrorCodes, errorMessages } from '../src/errors'
import { mangle } from '../src/mangler'
import { optimize } from '../src/optimizer'
import { createParser } from '../src/parser'

import type { MessageNode, PluralNode, ResourceNode } from '../src/nodes'

test('mangle', () => {
  const parser = createParser({ location: false })
  const msg = `no apples | {0} apple | {n} apples`
  const ast = optimize(parser.parse(msg))
  mangle(ast)

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
  expect(() => mangle(ast)).toThrowError(
    format(errorMessages[CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE], type)
  )
})
