import { createCompiler } from '../../src/message/compiler'

test('compile', () => {
  const compiler = createCompiler()
  const { code, ast } = compiler.compile('@.caml:(no apples) | {0} apple | {n}　apples')
  expect(code).toMatchSnapshot('code')
  expect(ast).toMatchSnapshot('ast')
})
