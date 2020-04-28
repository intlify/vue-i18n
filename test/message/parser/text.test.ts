import {
  createParser,
  NodeTypes,
  MessageNode,
  TextNode
} from '../../../src/message/parser'

let spy
beforeEach(() => {
  spy = jest.fn()
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

describe('included end brace', () => {
  test('hello :-}', () => {
    const text = 'hello :-}'
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

describe('included end paren', () => {
  test('hello :-)', () => {
    const text = 'hello :-)'
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

describe('empty string', () => {
  test(`''`, () => {
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

describe('include new line', () => {
  test('hello\nworld', () => {
    const text = 'hello\nworld'
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

test.todo(`...`)
test.todo(`hypen-nate`)
test.todo(`hello:`)
test.todo(`1 + 1`)
test.todo(`name = foo`)
test.todo(`'single-quote'`)
test.todo(`"double-qoute"`)
test.todo(` hello world `)
test.todo(`hello\\nworld`)
