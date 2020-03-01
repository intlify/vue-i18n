import { createParser } from '../../src/message/parser'

test('parse', () => {
  const parser = createParser()
  expect(parser.parse('hello world')).toMatchSnapshot()
  expect(parser.parse('hello {name} !')).toMatchSnapshot('named')
  expect(parser.parse('@:apples')).toMatchSnapshot('linked')
  expect(parser.parse('@.lower:{0}')).toMatchSnapshot('linked modifier list')
  expect(parser.parse('no apples | one apple  |  too much apples  ')).toMatchSnapshot('pural')
  expect(parser.parse('@.lower:(no apples) | {1} apple | {count}　apples')).toMatchSnapshot('pural complex')
})
