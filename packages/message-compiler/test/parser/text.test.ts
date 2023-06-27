import { createParser } from '../../src/parser'
import { NodeTypes } from '../../src/nodes'

import type { MessageNode, TextNode } from '../../src/nodes'

let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
beforeEach(() => {
  spy = vi.fn()
})

describe('simple', () => {
  test('hello,world', () => {
    const text = 'hello,world'
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()

    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(1)
    const item = message.items[0] as TextNode
    expect(item).toMatchObject({
      type: NodeTypes.Text,
      value: text
    })
  })
})

describe('multi bytes', () => {
  test('こんにちは、世界', () => {
    const text = 'こんにちは、世界'
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()
    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(1)
    const item = message.items[0] as TextNode
    expect(item).toMatchObject({
      type: NodeTypes.Text,
      value: text
    })
  })
})

describe('emoji', () => {
  test('😺', () => {
    const text = '😺'
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()
    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(1)
    const item = message.items[0] as TextNode
    expect(item).toMatchObject({
      type: NodeTypes.Text,
      value: text
    })
  })
})

describe('unicode', () => {
  const items = [
    { desc: `'\\u0041'`, data: '\u0041' },
    { desc: `'\\u{0041}'`, data: '\u{0041}' },
    { desc: `surrogate pair: '\\uD83C\\uDF4E'`, data: '\uD83C\uDF4E' }
  ]
  for (const target of items) {
    test(`${target.desc}`, () => {
      const text = target.data
      const parser = createParser({ onError: spy })
      const ast = parser.parse(text)

      expect(ast).toMatchSnapshot()
      expect(spy).not.toHaveBeenCalled()
      expect(ast.type).toEqual(NodeTypes.Resource)
      expect(ast.body.type).toEqual(NodeTypes.Message)
      const message = ast.body as MessageNode
      expect(message.items).toHaveLength(1)
      const item = message.items[0] as TextNode
      expect(item).toMatchObject({
        type: NodeTypes.Text,
        value: text
      })
    })
  }
})

describe('special characters', () => {
  const items = [
    { desc: `include new line '\\n'`, case: `hello\\nworld` },
    { desc: `include space ' '`, case: `hello nworld` },
    { desc: `include dot '.'`, case: `oh my god ...` },
    { desc: `include hypenate '-'`, case: `hi, kazu-pon !` },
    { desc: `include underscore '_'`, case: `hi, kazu_pon !` },
    { desc: `include dollar '$'`, case: 'hi, $jquery !' },
    { desc: `include colon ':'`, case: 'hello: kazupon !' },
    { desc: `include semi-colon ';'`, case: 'morning; afternoon;' },
    { desc: `include plus '+'`, case: `1 + 1` },
    { desc: `include equal '='`, case: 'name = foo' },
    { desc: `include single quote '\''`, case: `I'm kazupon !` },
    { desc: `include double quote '"'`, case: `"awesome" !` },
    { desc: `include exclamation '!'`, case: `WoW!` },
    { desc: `include hash '#'`, case: '# curry !' },
    { desc: `include caret '^'`, case: 'up^' },
    { desc: `include ampersand '&'`, case: 'Tom & Jerry' },
    { desc: `include asterisk '*'`, case: '3 * 4' },
    { desc: `include open paren '('`, case: `(foo)` },
    { desc: `include close paren ')'`, case: `hello :-)` },
    { desc: `include comma ','`, case: `hi, kazupon` },
    { desc: `include less than '<'`, case: `a < b` },
    { desc: `include greater than '>'`, case: `a > b` },
    { desc: `include open braket '['`, case: `land [ bridge` },
    { desc: `include close braket ']'`, case: `land ] bridge` },
    { desc: `include escase '\\'`, case: `escase \\ escape !` },
    { desc: `include grave '\`'`, case: `\`happy!!\`` },
    { desc: `include tilde '~'`, case: `~~kazupon~~` }
  ]
  for (const target of items) {
    test(`${target.desc}: '${target.case}'`, () => {
      const text = target.case
      const parser = createParser({ onError: spy })
      const ast = parser.parse(text)

      expect(ast).toMatchSnapshot()
      expect(spy).not.toHaveBeenCalled()
      expect(ast.type).toEqual(NodeTypes.Resource)
      expect(ast.body.type).toEqual(NodeTypes.Message)
      const message = ast.body as MessageNode
      expect(message.items).toHaveLength(1)
      const item = message.items[0] as TextNode
      expect(item).toMatchObject({
        type: NodeTypes.Text,
        value: text
      })
    })
  }

  test(`empty string: ''`, () => {
    const text = ''
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()
    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(0)
  })
})
