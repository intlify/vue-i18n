import { createParser } from '../../src/message/parser'
import { transform } from '../../src/message/transformer'
import { generate, INTERPOLATE_CODE } from '../../src/message/generator'

test('text', () => {
  const parser = createParser()
  const ast = parser.parse('hello world')
  transform(ast)
  const code = generate(ast)
  expect(code).toMatch(`return "hello world"`)
  expect(code).toMatchSnapshot()
})

test('list', () => {
  const parser = createParser()
  const ast = parser.parse('hi {0} !')
  transform(ast)
  const code = generate(ast)
  expect(code).toMatch(`${INTERPOLATE_CODE}`)
  expect(code).toMatch(`return [`)
  expect(code).toMatch(`"hi ", interpolate(ctx.list[0]), " !", ""`)
  expect(code).toMatch(`].join("")`)
  expect(code).toMatchSnapshot()
})

test('named', () => {
  const parser = createParser()
  const ast = parser.parse('hi {name} !')
  transform(ast)
  const code = generate(ast)
  expect(code).toMatch(`${INTERPOLATE_CODE}`)
  expect(code).toMatch(`return [`)
  expect(code).toMatch(`"hi ", interpolate(ctx.named.name), " !", ""`)
  expect(code).toMatch(`].join("")`)
  expect(code).toMatchSnapshot()
})

test('plural', () => {
  const parser = createParser()
  const ast = parser.parse('no apples | one apple  |  too much apples  ')
  transform(ast)
  const code = generate(ast)
  expect(code).toMatch(`return [`)
  expect(code).toMatch(`"no apples", "one apple", "too much apples  ", ""`)
  expect(code).toMatch(`[ctx.plural.rule(ctx.plural.index, 3)]`)
  expect(code).toMatchSnapshot()
})

/*
test('linked', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('hi @.upper:your_name !')
  expect(code).toMatchSnapshot()
})

test('plural', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('@:(no apples) | {0} apple | {n}　apples')
  expect(code).toMatchSnapshot()
})

test('empty', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('')
  // expect(code).toMatch(`return null`)
  expect(code).toMatchSnapshot()
})
*/
