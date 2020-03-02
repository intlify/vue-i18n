import { createCompiler } from '../../src/message/compiler'

test('text', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('hello world')
  expect(code).toMatchSnapshot(code)
})

test('list', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('hi {0} !')
  expect(code).toMatchSnapshot(code)
})

test('named', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('hi {name} !')
  expect(code).toMatchSnapshot(code)
})

test('linked', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('hi @.upper:your_name !')
  expect(code).toMatchSnapshot(code)
})

test('plural', () => {
  const compiler = createCompiler()
  const { code } = compiler.compile('@:(no apples) | {0} apple | {n}　apples')
  expect(code).toMatchSnapshot(code)
})
