import { CompileError, ParserOptions } from '../src'
import { createParser } from '../src/parser'

test('parse', () => {
  ;[
    { code: 'hello world', name: 'message' },
    { code: 'hello {name} !', name: 'named' },
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
    { code: `@.lower:(foo)`, name: 'linked key paren error with modifier' }
  ].forEach(({ name, code }) => {
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
  })
})
