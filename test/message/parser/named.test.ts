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
  test(`hi {name} !`, () => {
    const text = `hi {name} !`
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
        type: NodeTypes.Named,
        key: 'name'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('multiple', () => {
  /* eslint-disable no-irregular-whitespace */
  test(`{first} {middle}　{last}`, () => {
    const text = `{first} {middle}　{last}`
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
        type: NodeTypes.Named,
        key: 'first'
      },
      {
        type: NodeTypes.Text,
        value: ' '
      },
      {
        type: NodeTypes.Named,
        key: 'middle'
      },
      {
        type: NodeTypes.Text,
        value: '　'
      },
      {
        type: NodeTypes.Named,
        key: 'last'
      }
    ])
  })
  /* eslint-enable no-irregular-whitespace */
})

describe('whitespaces in placeholder', () => {
  test(`hi {  name } !`, () => {
    const text = `hi {  name } !`
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
        type: NodeTypes.Named,
        key: 'name'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('new lines in placeholder', () => {
  test(`{first}\n{middle}\n{last}`, () => {
    const text = `{first}\n{middle}\n{last}`
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
        type: NodeTypes.Named,
        key: 'first'
      },
      {
        type: NodeTypes.Text,
        value: '\n'
      },
      {
        type: NodeTypes.Named,
        key: 'middle'
      },
      {
        type: NodeTypes.Text,
        value: '\n'
      },
      {
        type: NodeTypes.Named,
        key: 'last'
      }
    ])
  })
})

test.todo(`hi {} !`)
test.todo(`hi {{}} !`)
test.todo(`hi {  } !`)
test.todo(`hi {name$} !`)
test.todo(`hi {snake_case} !`)
test.todo(`hi {\nname\n} !`)
test.todo(`hi {{name}} !`)
test.todo(`hi { { name } } !`)
test.todo(`hi {name !`)
test.todo(`hi { name !`)
test.todo(`hi {  name !`)
test.todo(`hi {@.lower:name !`)
test.todo(`hi { @:name !`)
test.todo(`hi {  | hello {name} !`)
test.todo(`hi { @:name  | hello {name} !`)
