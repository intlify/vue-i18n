import { createParser, NodeTypes } from '../src/parser'

import type { CompileError, ParserOptions } from '../src'
import type { Node, PluralNode, MessageNode, LinkedNode } from '../src/parser'

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

test('parser options: location disable', () => {
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

function traverse(node: Node, fn: (node: Node) => void) {
  fn(node)
  if (node.type === NodeTypes.Plural) {
    ;(node as PluralNode).cases.forEach(c => traverse(c, fn))
  } else if (node.type === NodeTypes.Message) {
    ;(node as MessageNode).items.forEach(c => traverse(c, fn))
  } else if (node.type === NodeTypes.Linked) {
    traverse((node as LinkedNode).key, fn)
  }
}
