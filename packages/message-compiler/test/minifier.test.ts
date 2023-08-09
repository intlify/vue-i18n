import { createParser } from '../src/parser'
import { optimize } from '../src/optimizer'
import { minify } from '../src/minifier'

import type { MessageNode, PluralNode } from '../src/nodes'

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
