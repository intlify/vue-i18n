import { createParser } from '../../src/message/parser'

test('parse', () => {
  const parser = createParser()
  expect(parser.parse('hello world')).toMatchSnapshot()
  expect(parser.parse('hello {name} !')).toMatchSnapshot('named')
  expect(parser.parse('hello {0} !')).toMatchSnapshot('list')
  expect(parser.parse('@:apples')).toMatchSnapshot('linked')
  expect(parser.parse('@.lower:{0}')).toMatchSnapshot('linked modifier list')
  expect(
    parser.parse('no apples | one apple  |  too much apples  ')
  ).toMatchSnapshot('plural')
  expect(
    parser.parse('@.lower:(no apples) | {1} apple | {count}　apples')
  ).toMatchSnapshot('plural complex')
})

/*
describe('Text', () => {
  test('simple', () => {
    const parser = createParser()
    expect(parser.parse('hello world')).toMatchSnapshot()
  })

  test('included end brace', () => {
    const spy = jest.fn()
    const parser = createParser({ onError: spy })
    expect(parser.parse('hello :-}')).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()
  })

  test('included end paren', () => {
    const spy = jest.fn()
    const parser = createParser({ onError: spy })
    expect(parser.parse('hello :-)')).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()
  })

  test('include at sign', () => {
    const spy = jest.fn()
    const parser = createParser({ onError: spy })
    expect(parser.parse('foo@bar.com')).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()
  })
})
*/
