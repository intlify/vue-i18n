import { createParser } from '../../src/parser'
import { NodeTypes } from '../../src/nodes'

import type { MessageNode } from '../../src/nodes'

let spy: any // eslint-disable-line @typescript-eslint/no-explicit-any
beforeEach(() => {
  spy = vi.fn()
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
  test(`4 digits: '\\u0041'`, () => {
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
        value: 'A'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })

  test(`6 digits: \\U01F602'`, () => {
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
        value: '😂'
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })
})

test('empty string', () => {
  const text = `{''}`
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
      type: NodeTypes.Literal,
      value: ''
    }
  ])
})

describe('intlify message syntax special characters', () => {
  const items = ['{', '}', '@', '|', '%']
  for (const ch of items) {
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
  }
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
  test(`backslash quote: '\\''`, () => {
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
        value: `'`
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })

  test(`backslash baackslash: '\\\\'`, () => {
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
        value: `\\`
      },
      {
        type: NodeTypes.Text,
        value: ' !'
      }
    ])
  })

  test(`unicode 4 digits: '\\\\u0041'`, () => {
    const text = `hi, {'\\\\u0041'} !`
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

  test(`unicode 6 digits: '\\\\U01F602'`, () => {
    const text = `hi, {'\\\\U01F602'} !`
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

describe('errors', () => {
  test(`unknown escape: '\\x41'`, () => {
    const text = `hi, {'\\x41'} !`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
  })

  test(`invalid unicode escape: hi { '\\uw' }`, () => {
    const text = `hi, {'\\uw'} !`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
  })

  test(`not close single quote at EOF: hi { 'foo`, () => {
    const text = `hi, {'foo`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
  })

  test(`not close single quote: hi { 'foo }`, () => {
    const text = `hi, { 'foo }`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
  })

  test(`include new line: hi { 'foo\\n' }`, () => {
    const text = `hi, { 'foo\n' }`
    const parser = createParser({ onError: spy })
    const ast = parser.parse(text)

    expect(ast).toMatchSnapshot()
    expect(spy).toHaveBeenCalled()
  })
})
