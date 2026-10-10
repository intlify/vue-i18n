import {
  format,
  generateCodeFrame,
  getOwn,
  isObjectPrototypeKey,
  join,
  makeSymbol,
  toDevtoolsGroupId
} from '../src/index'

test('getOwn', () => {
  const obj = { en: { hello: 'hello' } }
  expect(getOwn(obj, 'en')).toBe(obj.en)
  expect(getOwn(obj, 'ja')).toBeUndefined()
  for (const key of ['__proto__', 'constructor', 'toString']) {
    expect(getOwn(obj, key)).toBeUndefined()
  }
  // `__proto__` can be an own key, e.g. from `JSON.parse`
  expect(
    getOwn(JSON.parse('{"__proto__": {"hello": "hello"}}'), '__proto__')
  ).toEqual({
    hello: 'hello'
  })
})

test('isObjectPrototypeKey', () => {
  for (const key of [
    '__proto__',
    'constructor',
    'toString',
    'valueOf',
    'hasOwnProperty'
  ]) {
    expect(isObjectPrototypeKey(key)).toBe(true)
  }
  for (const key of ['en', 'ja-JP', 'prototype', '']) {
    expect(isObjectPrototypeKey(key)).toBe(false)
  }
})

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

test('toDevtoolsGroupId', () => {
  expect(toDevtoolsGroupId('translate', 'hello')).toEqual('translate:hello')
  expect(toDevtoolsGroupId('translate', 1)).toEqual('translate:1')
  expect(toDevtoolsGroupId('translate', Object.create(null))).toEqual(
    'translate'
  )
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
