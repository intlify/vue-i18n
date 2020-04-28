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
  test(`hello {'world'} !`, () => {
    const text = `hello {'world'} !`
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
        value: 'hello '
      },
      {
        type: NodeTypes.Literal,
        value: 'world'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('multi bytes', () => {
  test(`こんにちは、{'世界'}！`, () => {
    const text = `こんにちは、{'世界'}！`
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
        value: 'こんにちは、'
      },
      {
        type: NodeTypes.Literal,
        value: '世界'
      },
      {
        type: NodeTypes.Text,
        value: '！'
      }
    ])
  })
})

describe('emoji', () => {
  test(`hi, {'😺'} !`, () => {
    const text = `hi, {'😺'} !`
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: '😺'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('unicode', () => {
  test('4 digits', () => {
    const text = `hi, {'\u0041'} !`
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: '\u0041'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })

  test('6 digits', () => {
    const text = `hi, {'\U01F602'} !`
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: 'U01F602'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('intlify message syntax special characters', () => {
  ;['{', '}', '@', '|', '%'].forEach(ch => {
    test(`${ch}`, () => {
      const text = `hi, {'${ch}'} !`
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
          value: 'hi, '
        },
        {
          type: NodeTypes.Literal,
          value: `${ch}`
        },
        {
          type: NodeTypes.Text,
          value: ' !'
        }
      ])
    })
  })
})

describe('other special characters', () => {
  test(`!#%^&*()-_+=[]:;?.<>"`, () => {
    const text = "hi, {'!#%^&*()-_+=[]:;?.<>\"`'} !"
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: '!#%^&*()-_+=[]:;?.<>"`'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

describe('escapes', () => {
  test(`\\'`, () => {
    const text = `hi, {'\\''} !`
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: `\\'`
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })

  test(`\\\\`, () => {
    const text = `hi, {'\\\\'} !`
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: `\\\\`
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })

  test(`\\u0041`, () => {
    const text = `hi, {'\\u0041'} !`
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: `\\u0041`
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })

  test(`\\U01F602`, () => {
    const text = `hi, {'\\U01F602'} !`
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
        value: 'hi, '
      },
      {
        type: NodeTypes.Literal,
        value: `\\U01F602`
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

test.todo(`hi { 'foo`)
test.todo(`hi { 'foo }`)
test.todo(`hi { 'foo\n' }`)
test.todo(`hi { '\\x41' }`)
test.todo(`hi { '\\uw' }`)
