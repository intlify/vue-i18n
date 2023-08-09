import { baseCompile } from '@intlify/message-compiler'
import {
  compileToFunction,
  compile,
  clearCompileCache
} from '../src/compilation'
import { createMessageContext as context } from '../src/runtime'

beforeAll(() => {
  clearCompileCache()
})

describe('compileToFunction', () => {
  test('basic', () => {
    const msg = compileToFunction('hello {name}!')
    const ctx = context({
      named: { name: 'kazupon' }
    })
    expect(msg(ctx)).toBe('hello kazupon!')
  })

  test('error', () => {
    let occured = false
    compileToFunction('hello {name!', {
      onError: () => (occured = true)
    })
    expect(occured).toBe(true)
  })
})

describe('compile', () => {
  test('basic', () => {
    const msg = compile('hello {name}!')
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
      const msg = compile(ast)
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
      const msg = compile(ast)
      const ctx = context({
        named: { name: 'kazupon' }
      })
      expect(msg(ctx)).toBe('hello kazupon!')
    })
  })

  test('error', () => {
    let occured = false
    compile('hello {name!', {
      onError: () => (occured = true)
    })
    expect(occured).toBe(true)
  })
})
