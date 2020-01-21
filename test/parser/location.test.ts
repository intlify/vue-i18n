import { getLineInfo } from '../../src/parser/location'

test('getLineInfo', () => {
  const source = 'foo\nbar\r\nbuz\u2028foo\u2029bar'
  const position = getLineInfo(source, 20)
  expect(position).toEqual({
    column: 3,
    line: 5,
    offset: 20
  })
})
