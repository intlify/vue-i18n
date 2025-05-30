import { parse, resolveValue } from '../src/resolver'
import { ast } from './fixtures/ast'

test('parse', () => {
  expect(parse('a')).toEqual(['a'])
  expect(parse('A')).toEqual(['A'])
  expect(parse('0')).toEqual(['0'])
  expect(parse('-1')).toEqual(['-1'])
  expect(parse('_')).toEqual(['_'])
  expect(parse('-')).toEqual(['-'])
  expect(parse('[')).toBeUndefined()
  expect(parse(']')).toBeUndefined()
  expect(parse('(')).toEqual(['('])
  expect(parse(')')).toEqual([')'])
  expect(parse('{')).toEqual(['{'])
  expect(parse('}')).toEqual(['}'])
  expect(parse('<')).toEqual(['<'])
  expect(parse('>')).toEqual(['>'])
  expect(parse('"')).toBeUndefined()
  expect(parse("'")).toBeUndefined()
  expect(parse('.')).toBeUndefined()
  expect(parse(';')).toEqual([';'])
  expect(parse(':')).toEqual([':'])
  expect(parse('=')).toEqual(['='])
  expect(parse('|')).toEqual(['|'])
  expect(parse('*')).toEqual(['*'])
  expect(parse('+')).toEqual(['+'])
  expect(parse('?')).toEqual(['?'])
  expect(parse('/')).toEqual(['/'])
  expect(parse(',')).toEqual([','])
  expect(parse('~')).toEqual(['~'])
  expect(parse('`')).toEqual(['`'])
  expect(parse('@')).toEqual(['@'])
  expect(parse('#')).toEqual(['#'])
  expect(parse('`')).toEqual(['`'])
  expect(parse('@')).toEqual(['@'])
  expect(parse('#')).toEqual(['#'])
  expect(parse('%')).toEqual(['%'])
  expect(parse('^')).toEqual(['^'])
  expect(parse('&')).toEqual(['&'])
  expect(parse('\n')).toEqual([])
  expect(parse('\t')).toEqual([])
  expect(parse('$')).toEqual(['$'])
  expect(parse('_a')).toEqual(['_a'])
  expect(parse('$a')).toEqual(['$a'])
  expect(parse('ab')).toEqual(['ab'])
  expect(parse('Ab')).toEqual(['Ab'])
  expect(parse('10')).toEqual(['10'])
  expect(parse('00')).toEqual(['00'])
  expect(parse('"a"')).toBeUndefined()
  expect(parse("'a'")).toBeUndefined()
  expect(parse('[]')).toBeUndefined()
  expect(parse('[0]')).toEqual(['0'])
  expect(parse('["0"]')).toEqual(['0'])
  expect(parse('[99]')).toEqual(['99'])
  expect(parse('()')).toEqual(['()'])
  expect(parse('(0)')).toEqual(['(0)'])
  expect(parse('{}')).toEqual(['{}'])
  expect(parse('{0}')).toEqual(['{0}'])
  expect(parse('${name}')).toEqual(['${name}'])
  expect(parse('tag`Hello ${ a + b } world ${ a * b}`')).toEqual([
    'tag`Hello ${ a + b } world ${ a * b}`'
  ])
  expect(parse('a-b')).toEqual(['a-b'])
  expect(parse('a+b')).toEqual(['a+b'])
  expect(parse('a_b')).toEqual(['a_b'])
  expect(parse('a.b')).toEqual(['a', 'b'])
  expect(parse('a b')).toEqual(['a b'])
  expect(parse('a[0]')).toEqual(['a', '0'])
  expect(parse('a.b.c')).toEqual(['a', 'b', 'c'])
  expect(parse('a.b. c')).toEqual(['a', 'b', ' c']) // TODO:
  expect(parse('a.b [0]')).toEqual(['a', 'b ', '0']) // TODO:
  expect(parse('a.b[0].c')).toEqual(['a', 'b', '0', 'c'])
  expect(parse('a.b[a].c')).toEqual(['a', 'b', '*a', 'c'])
  expect(parse('a.b["a"].c')).toEqual(['a', 'b', 'a', 'c'])
  expect(parse('a.b[].c')).toBeUndefined()
  expect(parse('a.b[a.b[a[0]]].c')).toEqual(['a', 'b', '*a.b[a[0]]', 'c'])
  expect(parse('a\\b')).toEqual(['a\\b'])
  expect(parse('a\nb')).toBeUndefined()
  expect(parse('a\tb')).toBeUndefined()
  expect(parse('a..b')).toBeUndefined()
  expect(parse('a.$b')).toEqual(['a', '$b'])
  expect(parse('1+1')).toEqual(['1+1'])
  expect(parse('hi ${name}!')).toEqual(['hi ${name}!'])
  expect(parse('あ')).toEqual(['あ'])
  expect(parse('あ.い')).toEqual(['あ', 'い'])
  expect(parse('🌐')).toEqual(['🌐'])
  expect(parse('👨‍👩‍👧‍👦')).toEqual(['👨‍👩‍👧‍👦'])
  expect(parse('💁🏽‍♀️')).toEqual(['💁🏽‍♀️'])
  expect(parse('🌐.🌐')).toEqual(['🌐', '🌐'])
})

describe('resolveValue', () => {
  test('basic', () => {
    // primitive
    expect(resolveValue({ a: { b: 1 } }, 'a.b')).toEqual(1)
    // whitespace
    expect(resolveValue({ 'a c': 1 }, 'a c')).toEqual(1)
    expect(resolveValue({ 'a\tc': 1 }, 'a\tc')).toEqual(null)
    // object
    expect(resolveValue({ a: { b: 1 } }, 'a')).toEqual({ b: 1 })
    expect(resolveValue({ a: { 'b c d': 1 } }, 'a.b c d')).toEqual(1)
    // number key in object
    expect(
      resolveValue({ errors: { '1': 'error number 1' } }, 'errors[1]')
    ).toEqual('error number 1')
    // array index path
    expect(resolveValue({ errors: ['error number 0'] }, 'errors[0]')).toEqual(
      'error number 0'
    )
    // array path
    expect(resolveValue({ errors: ['error number 0'] }, 'errors')).toEqual([
      'error number 0'
    ])
    // not found
    expect(resolveValue({}, 'a.b')).toEqual(null)
    // object primitive
    expect(resolveValue(10, 'a.b')).toEqual(null)
    // object null
    expect(resolveValue(null, 'a.b')).toEqual(null)
    // blanket term
    expect(resolveValue({}, 'a.b.c[]')).toEqual(null)
    // blanket middle
    expect(resolveValue({}, 'a.b.c[]d')).toEqual(null)
    // function
    const fn = () => 1
    expect(resolveValue({ a: fn }, 'a.name')).toEqual(null)
    expect(resolveValue({ a: fn }, 'a.toString')).toEqual(null)
    expect(resolveValue({ a: fn }, 'a')).toEqual(fn)
    // json path
    expect(resolveValue({ 'a.b': 1 }, 'a.b')).toEqual(null)
  })

  test('ast', () => {
    expect(resolveValue(ast, 'language')).toEqual(ast.language)
    expect(resolveValue(ast, 'product')).toEqual(ast.product)
    expect(resolveValue(ast, 'product.type')).toEqual(null)
    expect(resolveValue(ast, 'product.test.type')).toEqual(null)
  })
})
