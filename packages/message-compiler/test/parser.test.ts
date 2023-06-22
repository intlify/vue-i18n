import { createParser } from '../src/parser'
import { traverse } from './helper'

import type { CompileError, ParserOptions } from '../src'

const cases = [
  { code: 'hello world', name: 'message' },
  { code: 'hello {name} !', name: 'named' },
  { code: 'hello {_name} !', name: 'named' },
  { code: 'hello {0} !', name: 'list' },
  { code: `hello {'kazupon'} !`, name: 'literal' },
  { code: '@:apples', name: 'linked' },
  { code: '@.lower:{0}', name: 'linked modifier list' },
  { code: 'no apples | one apple  |  too much apples  ', name: 'plural' },
  {
    code: `@.lower:{'no apples'} | {1} apple | {count}　apples`, // eslint-disable-line no-irregular-whitespace
    name: 'plural complex'
  },
  { code: `@.: a`, name: 'linked error' },
  { code: `@.:foo`, name: 'linked modifier error' },
  { code: `@:(foo)`, name: 'linked key paren error' },
  { code: `hi @._upper:{_name} !`, name: 'foo' },
  { code: `@.lower:(foo)`, name: 'linked key paren error with modifier' },
  { code: `@.`, name: 'EOF in linked modifier' },
  { code: `|`, name: 'empty plural' }
]

test('parse', () => {
  for (const { name, code } of cases) {
    const errors: CompileError[] = []
    const options: ParserOptions = {
      onError: err => {
        errors.push({ ...err, message: err.message })
      }
    }
    const parser = createParser(options)
    const ast = parser.parse(code)
    expect(ast).toMatchSnapshot(name || JSON.stringify(code))

    if (errors.length) {
      expect(errors).toMatchSnapshot(`${name || JSON.stringify(code)} errors`)
    }
  }
})

describe('parser options', () => {
  test('location disable', () => {
    for (const { name, code } of cases) {
      const errors: CompileError[] = []
      const options: ParserOptions = {
        location: false,
        onError: err => {
          errors.push({ ...err, message: err.message })
        }
      }
      const parser = createParser(options)
      const ast = parser.parse(code)
      traverse(ast, node => {
        expect(node.start).toBeUndefined()
        expect(node.end).toBeUndefined()
        expect(node.loc).toBeUndefined()
      })
      expect(ast).toMatchSnapshot(name || JSON.stringify(code))

      if (errors.length) {
        expect(errors).toMatchSnapshot(`${name || JSON.stringify(code)} errors`)
        for (const error of errors) {
          expect(error.location).toBeUndefined()
        }
      }
    }
  })

  test('cacheId generation', () => {
    const options: ParserOptions = {
      generateCacheId: source => source
    }
    const parser = createParser(options)
    const ast = parser.parse('hello {name}!')
    expect(ast.cacheId).toBeDefined()
  })
})
