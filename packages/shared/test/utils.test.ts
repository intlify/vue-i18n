import { format, generateCodeFrame, makeSymbol } from '../src/index'

test('format', () => {
  expect(format(`foo: {0}`, 'x')).toEqual('foo: x')
  expect(format(`foo: {0}, {1}`, 'x', 'y')).toEqual('foo: x, y')
  expect(format(`foo: {x}, {y}`, { x: 1, y: 2 })).toEqual('foo: 1, 2')
})

test('generateCodeFrame', () => {
  const source = `hi, { 'kazupon' }`.trim()
  const keyStart = source.indexOf(`{ 'kazupon' }`)
  const keyEnd = keyStart + `{ 'kazupon' }`.length
  expect(generateCodeFrame(source, keyStart, keyEnd)).toMatchSnapshot()
})

test('makeSymbol', () => {
  expect(makeSymbol('foo')).not.toEqual(makeSymbol('foo'))
  expect(makeSymbol('bar', true)).toEqual(makeSymbol('bar', true))
})
