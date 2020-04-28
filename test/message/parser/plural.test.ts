import {
  createParser,
  NodeTypes,
  PluralNode
} from '../../../src/message/parser'

let spy
beforeEach(() => {
  spy = jest.fn()
})

describe('basic', () => {
  test(`no apples | one apple  |  too much apples `, () => {
    const text = 'no apples | one apple  |  too much apples '
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
            value: 'no apples'
          }
        ]
      },
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text,
            value: 'one apple'
          }
        ]
      },
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text,
            value: 'too much apples '
          }
        ]
      }
    ])
  })
})

describe('included new line', () => {
  test(`no apples |\n one apple  |\n  too much apples  `, () => {
    const text = 'no apples |\n one apple  |\n  too much apples  '
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
            value: 'no apples'
          }
        ]
      },
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text,
            value: 'one apple'
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
})

describe('complex usage', () => {
  // eslint-disable-next-line no-irregular-whitespace
  test(`@.lower:{'no apples'} | {1} apple | {count}　apples`, () => {
    // eslint-disable-next-line no-irregular-whitespace
    const text = `@.lower:{'no apples'} | {1} apple | {count}　apples`
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
            type: NodeTypes.Linked,
            key: {
              type: NodeTypes.Literal,
              value: 'no apples'
            },
            modifier: {
              type: NodeTypes.LinkedModifier,
              value: 'lower'
            }
          }
        ]
      },
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.List,
            index: 1
          },
          {
            type: NodeTypes.Text,
            value: ' apple'
          }
        ]
      },
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Named,
            key: 'count'
          },
          {
            type: NodeTypes.Text,
            value: '　apples'
          }
        ]
      }
    ])
  })
})

test.todo(` | | |`)
test.todo(` foo | | bar`)
test.todo(`@.lower: {'no apples'} | {1 apple | @:{count　apples`) // eslint-disable-line no-irregular-whitespace
