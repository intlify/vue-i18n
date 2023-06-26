import { createParser } from '../src/parser'
import { optimize } from '../src/optimizer'

import type { MessageNode, PluralNode } from '../src/nodes'

test(`text only: hello world`, () => {
  const parser = createParser({ location: false })
  const msg = 'hello world'
  const ast = optimize(parser.parse(msg))

  expect((ast.body as MessageNode).static).toBe(msg)
  expect(ast).toMatchSnapshot()
})

test(`literal only: {'hello world'}`, () => {
  const parser = createParser({ location: false })
  const msg = `{'hello world'}`
  const ast = optimize(parser.parse(msg))

  expect((ast.body as MessageNode).static).toBe('hello world')
  expect(ast).toMatchSnapshot()
})

test(`full text items: foo{'@'}domain.com`, () => {
  const parser = createParser({ location: false })
  const msg = `foo{'@'}domain.com`
  const ast = optimize(parser.parse(msg))

  expect((ast.body as MessageNode).static).toBe('foo@domain.com')
  expect(ast).toMatchSnapshot()
})

test(`full text message on plural: no apples | one apple | many apples`, () => {
  const parser = createParser({ location: false })
  const msg = `no apples | one apple | many apples`
  const ast = optimize(parser.parse(msg))

  expect(ast).toMatchSnapshot()
  const messages = (ast.body as PluralNode).cases.map(
    node => (node as MessageNode).static
  )
  expect(messages).toEqual(['no apples', 'one apple', 'many apples'])
})

test('incldue dynamic node: hello, {name} !', () => {
  const parser = createParser({ location: false })
  const msg = `hello, {name} !`
  const ast = optimize(parser.parse(msg))

  expect((ast.body as MessageNode).static).toBeUndefined()
  expect(ast).toMatchSnapshot()
})

test(`incldue dynamic node in pluarl: no apples | {0} apple | {n} apples`, () => {
  const parser = createParser({ location: false })
  const msg = `no apples | {0} apple | {n} apples`
  const ast = optimize(parser.parse(msg))

  expect(ast).toMatchSnapshot()
  const messages = (ast.body as PluralNode).cases
    .map(node => (node as MessageNode).static)
    .filter(Boolean)
  expect(messages).toEqual(['no apples'])
})
