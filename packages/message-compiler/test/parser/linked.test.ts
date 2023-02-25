import { createParser, NodeTypes, MessageNode } from '../../src/parser'

let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
beforeEach(() => {
  spy = vi.fn()
})

describe('basic', () => {
  test(`hi @:name !`, () => {
    const text = `hi @:name !`
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
        type: NodeTypes.Linked,
        key: {
          type: NodeTypes.LinkedKey,
          value: 'name'
        }
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('literal key', () => {
  test(`hi @:{'hello world'} !`, () => {
    const text = `hi @:{'hello world'} !`
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
        type: NodeTypes.Linked,
        key: {
          type: NodeTypes.Literal,
          value: 'hello world'
        }
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('terminated with new line', () => {
  test(`hi @:{name}\n !`, () => {
    const text = `hi @:{name}\n !`
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
        type: NodeTypes.Linked,
        key: {
          type: NodeTypes.Named,
          key: 'name'
        }
      },
      {
        type: NodeTypes.Text,
        value: '\n !'
      }
    ])
  })
})

describe('modifier', () => {
  test(`hi @.upper:name !`, () => {
    const text = `hi @.upper:{name} !`
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
        type: NodeTypes.Linked,
        key: {
          type: NodeTypes.Named,
          key: 'name'
        },
        modifier: {
          type: NodeTypes.LinkedModifier,
          value: 'upper'
        }
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('multiple', () => {
  test(`hi @:{name} @:{0}!`, () => {
    const text = `hi @:{name} @:{0}!`
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
        type: NodeTypes.Text,
        value: 'hi '
      },
      {
        type: NodeTypes.Linked,
        key: {
          type: NodeTypes.Named,
          key: 'name'
        }
      },
      {
        type: NodeTypes.Text,
        value: ' '
      },
      {
        type: NodeTypes.Linked,
        key: {
          type: NodeTypes.List,
          index: 0
        }
      },
      {
        type: NodeTypes.Text,
        value: '!'
      }
    ])
  })
})

describe('edge cases', () => {
  test.todo(`hi @:{ name } !`)
  test.todo(`hi @:{ 'name' } !`)
  test.todo(`hi @:{ {name} } !`)
  test.todo(`foo@bar.com`)
  test.todo(`hi @:\nname !`)
  test.todo(`hi @ :name !`)
  test.todo(`hi @. {name} !`)
  test.todo(`hi @.\n{name} !`)
  test.todo(`hi @.upper\n{name} !`)
  test.todo(`hi @.upper {name} !`)
  test.todo(`hi @:\n{name} !`)
  test.todo(`hi @: {'name'} !`)
  test.todo(`hi @. {name} !`)
  test.todo(`hi @\. upper\n: {'name'}\n !`)
})
