import { NodeTypes } from '@intlify/message-compiler'
import { format } from '../src/format'
import { createMessageContext as context } from '../src/runtime'

import type { ResourceNode } from '@intlify/message-compiler'

describe('CVE-2024-52809', () => {
  function attackGetter() {
    return 'polluted'
  }

  afterEach(() => {
    // @ts-ignore -- initialize polluted property
    delete Object.prototype.static
  })

  test('success', () => {
    Object.defineProperty(Object.prototype, 'static', {
      configurable: true,
      get: attackGetter
    })
    const ast: ResourceNode = {
      type: NodeTypes.Resource,
      body: {
        type: NodeTypes.Message,
        static: 'hello world',
        items: [
          {
            type: NodeTypes.Text
          }
        ]
      }
    }
    const msg = format(ast)
    const ctx = context()
    expect(msg(ctx)).toEqual('hello world')
  })

  test('error', () => {
    Object.defineProperty(Object.prototype, 'static', {
      configurable: true,
      get: attackGetter
    })
    const ast: ResourceNode = {
      type: NodeTypes.Resource,
      body: {
        type: NodeTypes.Message,
        items: [
          {
            type: NodeTypes.Text
          }
        ]
      }
    }
    const msg = format(ast)
    const ctx = context()
    expect(() => msg(ctx)).toThrow(`unhandled node type: ${NodeTypes.Text}`)
  })
})
