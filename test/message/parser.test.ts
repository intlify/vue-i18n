import { createParser } from '../../src/message/parser'

test('parse', () => {
  const parser = createParser()
  expect(parser.parse('hello world')).toMatchSnapshot()
  expect(parser.parse('hello {name} !')).toMatchSnapshot('named')
  expect(parser.parse('hello {0} !')).toMatchSnapshot('list')
  expect(parser.parse(`hello {'kazupon'} !`)).toMatchSnapshot('literal')
  expect(parser.parse('@:apples')).toMatchSnapshot('linked')
  expect(parser.parse('@.lower:{0}')).toMatchSnapshot('linked modifier list')
  expect(
    parser.parse('no apples | one apple  |  too much apples  ')
  ).toMatchSnapshot('plural')
  expect(
    parser.parse(`@.lower:{'no apples'} | {1} apple | {count}　apples`) // eslint-disable-line no-irregular-whitespace
  ).toMatchSnapshot('plural complex')
})
