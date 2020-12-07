import { createParser } from '../src/parser'
import { transform } from '../src/transformer'

test('transform', () => {
  const parser = createParser()
  const ast = parser.parse(
    `@.upper:{'no apples'} | {0} apple | {count}　apples` // eslint-disable-line no-irregular-whitespace
  ) // eslint-disable-line no-irregular-whitespace
  transform(ast)
  expect(ast.helpers).toMatchSnapshot('helpers')
  expect(ast).toMatchSnapshot('ast')
})
