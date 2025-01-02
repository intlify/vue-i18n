// utils
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})

import { baseCompile } from '@intlify/message-compiler'
import { clearCompileCache, compile, isMessageAST } from '../src/compilation'
import { createMessageContext as context } from '../src/runtime'

const DEFAULT_CONTEXT = { locale: 'en', key: 'key' }

beforeEach(() => {
  clearCompileCache()
})

describe('isMessageAST', () => {
  describe('basic AST', () => {
    test('should be true', () => {
      expect(isMessageAST({ type: 0, body: '' })).toBe(true)
    })
  })

  describe('mangle AST', () => {
    test('should be true', () => {
      expect(isMessageAST({ type: 0, b: '' })).toBe(true)
    })
  })

  describe('not message compiler AST format', () => {
    test('should be false', () => {
      expect(isMessageAST({ b: '' })).toBe(false)
    })
  })
})

describe('compile', () => {
  test('basic', () => {
    const msg = compile('hello {name}!', DEFAULT_CONTEXT)
    const ctx = context({
      named: { name: 'kazupon' }
    })
    expect(msg(ctx)).toBe('hello kazupon!')
  })

  describe('AST', () => {
    test('basic', () => {
      const { ast } = baseCompile('hello {name}!', {
        location: false,
        jit: true
      })
      const msg = compile(ast, DEFAULT_CONTEXT)
      const ctx = context({
        named: { name: 'kazupon' }
      })
      expect(msg(ctx)).toBe('hello kazupon!')
    })

    test('mangle', () => {
      const { ast } = baseCompile('hello {name}!', {
        location: false,
        jit: true,
        mangle: true
      })
      const msg = compile(ast, DEFAULT_CONTEXT)
      const ctx = context({
        named: { name: 'kazupon' }
      })
      expect(msg(ctx)).toBe('hello kazupon!')
    })
  })

  test('list issue', () => {
    const { ast } = baseCompile('hello {0}!', {
      location: false,
      jit: true,
      mangle: true
    })
    const msg = compile(ast, DEFAULT_CONTEXT)
    const ctx = context({
      list: ['kazupon']
    })
    expect(msg(ctx)).toBe('hello kazupon!')
  })

  test('error', () => {
    let occured = false
    compile('hello {name!', {
      ...DEFAULT_CONTEXT,
      onError: () => (occured = true)
    })
    expect(occured).toBe(true)
  })
})
