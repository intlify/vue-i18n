// utils
import * as shared from '@intlify/shared'
vi.mock('@intlify/shared', async () => {
  const actual = await vi.importActual<object>('@intlify/shared')
  return {
    ...actual,
    warn: vi.fn()
  }
})

import { baseCompile } from '@intlify/message-compiler'
import {
  compileToFunction,
  compile,
  isMessageAST,
  clearCompileCache
} from '../src/compilation'
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

  describe('minify AST', () => {
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

describe('compileToFunction', () => {
  test('basic', () => {
    const msg = compileToFunction('hello {name}!', DEFAULT_CONTEXT)
    const ctx = context({
      named: { name: 'kazupon' }
    })
    expect(msg(ctx)).toBe('hello kazupon!')
  })

  test('error', () => {
    let occured = false
    compileToFunction('hello {name!', {
      ...DEFAULT_CONTEXT,
      onError: () => (occured = true)
    })
    expect(occured).toBe(true)
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

    test('minify', () => {
      const { ast } = baseCompile('hello {name}!', {
        location: false,
        jit: true,
        minify: true
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
      minify: true
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
