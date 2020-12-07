import {
  createParser,
  NodeTypes,
  PluralNode,
  MessageNode
} from '../../src/parser'

let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
beforeEach(() => {
  spy = jest.fn()
})

test('hi %{name}!', () => {
  const text = `hi %{name}!`
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
      value: '!'
    }
  ])
})

test('hi % {name}!', () => {
  const text = `hi % {name}!`
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
      value: 'hi % '
    },
    {
      type: NodeTypes.Named,
      key: 'name'
    },
    {
      type: NodeTypes.Text,
      value: '!'
    }
  ])
})

test('hi %@:name !', () => {
  const text = `hi %@:name !`
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
      value: 'hi %'
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

test('hi %d %s !', () => {
  const text = `hi %d %s !`
  const parser = createParser({ onError: spy })
  const ast = parser.parse(text)

  expect(ast).toMatchSnapshot()
  expect(spy).not.toHaveBeenCalled()

  expect(ast.type).toEqual(NodeTypes.Resource)
  expect(ast.body.type).toEqual(NodeTypes.Message)
  const message = ast.body as MessageNode
  expect(message.items).toHaveLength(1)
  expect(message.items).toMatchObject([
    {
      type: NodeTypes.Text,
      value: 'hi %d %s !'
    }
  ])
})

test('hi %% name !', () => {
  const text = `hi %% name !`
  const parser = createParser({ onError: spy })
  const ast = parser.parse(text)

  expect(ast).toMatchSnapshot()
  expect(spy).not.toHaveBeenCalled()

  expect(ast.type).toEqual(NodeTypes.Resource)
  expect(ast.body.type).toEqual(NodeTypes.Message)
  const message = ast.body as MessageNode
  expect(message.items).toHaveLength(1)
  expect(message.items).toMatchObject([
    {
      type: NodeTypes.Text,
      value: 'hi %% name !'
    }
  ])
})

test('no apples %| one apple % |  too much apples  ', () => {
  const text = `no apples %| one apple % |  too much apples  `
  const parser = createParser({ onError: spy })
  const ast = parser.parse(text)

  expect(ast).toMatchSnapshot()
  expect(spy).not.toHaveBeenCalled()

  expect(ast.type).toEqual(NodeTypes.Resource)
  expect(ast.body.type).toEqual(NodeTypes.Plural)
  const plural = ast.body as PluralNode
  expect(plural.cases).toHaveLength(3)
  expect(plural.cases).toMatchObject([
    {
      type: NodeTypes.Message,
      items: [
        {
          type: NodeTypes.Text,
          value: 'no apples %'
        }
      ]
    },
    {
      type: NodeTypes.Message,
      items: [
        {
          type: NodeTypes.Text,
          value: 'one apple %'
        }
      ]
    },
    {
      type: NodeTypes.Message,
      items: [
        {
          type: NodeTypes.Text,
          value: 'too much apples  '
        }
      ]
    }
  ])
})
