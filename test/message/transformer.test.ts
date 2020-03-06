import { createParser } from '../../src/message/parser'
import { transform } from '../../src/message/transformer'

test('transform', () => {
  const parser = createParser()
  const ast = parser.parse('@.upper:(no apples) | {0} apple | {count}　apples')
  transform(ast)
  expect(ast.needInterpolate).toEqual(true)
  expect(ast).toMatchSnapshot(ast)
})
