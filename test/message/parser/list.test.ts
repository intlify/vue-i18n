import {
  createParser,
  NodeTypes,
  MessageNode
} from '../../../src/message/parser'

let spy
beforeEach(() => {
  spy = jest.fn()
})

describe('basic', () => {
  test(`hi {0} !`, () => {
    const text = `hi {0} !`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()

    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(3)
    expect(message.items).toMatchObject([
      {
        type: NodeTypes.Text,
        value: 'hi '
      },
      {
        type: NodeTypes.List,
        index: 0
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('multiline', () => {
  /* eslint-disable no-irregular-whitespace */
  test(`{0} {1}　{2}`, () => {
    const text = `{0} {1}　{2}`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()

    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(5)
    expect(message.items).toMatchObject([
      {
        type: NodeTypes.List,
        index: 0
      },
      {
        type: NodeTypes.Text,
        value: ' '
      },
      {
        type: NodeTypes.List,
        index: 1
      },
      {
        type: NodeTypes.Text,
        value: '　'
      },
      {
        type: NodeTypes.List,
        index: 2
      }
    ])
  })
  /* eslint-enable no-irregular-whitespace */
})

describe('whitespaces in placeholder', () => {
  test(`hi {  -1 } !`, () => {
    const text = `hi {  -1 } !`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()

    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(3)
    expect(message.items).toMatchObject([
      {
        type: NodeTypes.Text,
        value: 'hi '
      },
      {
        type: NodeTypes.List,
        index: -1
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('new lines in placeholder', () => {
  test(`{0}\n{1}\n{2}`, () => {
    const text = `{0}\n{1}\n{2}`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).not.toHaveBeenCalled()

    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Message)
    const message = ast.body as MessageNode
    expect(message.items).toHaveLength(5)
    expect(message.items).toMatchObject([
      {
        type: NodeTypes.List,
        index: 0
      },
      {
        type: NodeTypes.Text,
        value: '\n'
      },
      {
        type: NodeTypes.List,
        index: 1
      },
      {
        type: NodeTypes.Text,
        value: '\n'
      },
      {
        type: NodeTypes.List,
        index: 2
      }
    ])
  })
})

test.todo(`hi {{0}} !`)
test.todo(`hi { { 0 } } !`)
test.todo(`hi {0 !`)
test.todo(`hi {  0 !`)
