import {
  createParser,
  NodeTypes,
  PluralNode,
  ERROR_DOMAIN
} from '../../src/parser'
import { CompileErrorCodes, errorMessages } from '../../src/errors'

let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
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

describe('empty message', () => {
  test(` | | |`, () => {
    const text = ` | | |`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
    expect(
      spy.mock.calls.map(([err]: Array<Error>) => ({
        ...err,
        message: err.message
      })) // @ts-ignore
    ).toEqual([
      {
        domain: ERROR_DOMAIN,
        code: CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL,
        message: errorMessages[CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL],
        location: {
          start: {
            line: 1,
            offset: 0,
            column: 1
          },
          end: {
            line: 1,
            offset: 6,
            column: 7
          }
        }
      }
    ])

    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Plural)
    const plural = ast.body as PluralNode
    expect(plural.cases).toHaveLength(4)
    expect(plural.cases).toMatchObject([
      {
        type: NodeTypes.Message,
        items: []
      },
      {
        type: NodeTypes.Message,
        items: []
      },
      {
        type: NodeTypes.Message,
        items: []
      },
      {
        type: NodeTypes.Message,
        items: []
      }
    ])
  })
})

describe('one empty message', () => {
  test(` foo | | bar | buz`, () => {
    const text = ` foo | | bar | buz`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
    expect(
      spy.mock.calls.map(([err]: Array<Error>) => ({
        ...err,
        message: err.message
      }))
    ).toEqual([
      {
        domain: ERROR_DOMAIN,
        code: CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL,
        message: errorMessages[CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL],
        location: {
          start: {
            line: 1,
            offset: 0,
            column: 1
          },
          end: {
            line: 1,
            offset: 18,
            column: 19
          }
        }
      }
    ])

    expect(ast.type).toEqual(NodeTypes.Resource)
    expect(ast.body.type).toEqual(NodeTypes.Plural)
    const plural = ast.body as PluralNode
    expect(plural.cases).toHaveLength(4)
    expect(plural.cases).toMatchObject([
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text,
            value: ' foo'
          }
        ]
      },
      {
        type: NodeTypes.Message,
        items: []
      },
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text,
            value: 'bar'
          }
        ]
      },
      {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text,
            value: 'buz'
          }
        ]
      }
    ])
  })
})

test.todo(`@.lower: {'no apples'} | {1 apple | @:{count　apples`) // eslint-disable-line no-irregular-whitespace
