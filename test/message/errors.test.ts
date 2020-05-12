import { format } from '../../src/message/errors'

test('format', () => {
  expect(format(`foo: {0}`, 'x')).toEqual('foo: x')
  expect(format(`foo: {0}, {1}`, 'x', 'y')).toEqual('foo: x, y')
  expect(format(`foo: {x}, {y}`, { x: 1, y: 2 })).toEqual('foo: 1, 2')
})
