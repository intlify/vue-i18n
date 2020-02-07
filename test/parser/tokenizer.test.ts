import { createTokenizer } from '../../src/parser/tokenizer'

test('Text only', () => {
  const tokenizer = createTokenizer()

  const tokens1 = tokenizer.parse('hello world!')
  expect(tokens1).toMatchSnapshot('basic')

  const tokens2 = tokenizer.parse('hello\nworld!')
  expect(tokens2).toMatchSnapshot('multiline')
})

/*
test('plural', () => {
  const tokenizer = createTokenizer()

  const tokens1 = tokenizer.parse('no apples | one apple  |  too much apples  ')
  expect(tokens1).toMatchSnapshot('basic')

  const tokens2 = tokenizer.parse('no apples |\n one apple |\n too much apples')
  expect(tokens2).toMatchSnapshot('multiline')
})
*/

/*
test('named placeholder', () => {
  const tokenizer = createTokenizer()

  const tokens1 = tokenizer.parse('hi {name}!')
  expect(tokens1).toMatchSnapshot('basic')

  const tokens2 = tokenizer.parse('{last} {middle} {first}')
  expect(tokens2).toMatchSnapshot('multiple')

  const tokens3 = tokenizer.parse('hi {  name }!')
  expect(tokens3).toMatchSnapshot('spaces')

  const tokens4 = tokenizer.parse(`lastName: {last}\nmiddleName: {middle}\r\nfirstName: {first}`)
  expect(tokens4).toMatchSnapshot('multline')
})
*/
