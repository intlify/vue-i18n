import { format, generateCodeFrame, makeSymbol, join } from '../src/index'

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

test('join', () => {
  expect(join([])).toEqual([].join(''))
  expect(join(['a'], ',')).toEqual(['a'].join(','))
  expect(join(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'].join(''))
  expect(join(['a', 'b', 'c'], ' ')).toEqual(['a', 'b', 'c'].join(' '))

  const longSize = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  expect(join(longSize, ' ')).toEqual(longSize.join(' '))
})
