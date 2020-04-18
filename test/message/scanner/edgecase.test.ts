import { createScanner } from '../../../src/message/scanner'

test(`\\r\\n`, () => {
  const s = createScanner(`hello!\\r\\nこんにちは！`)

  s.next() // h
  s.next() // e
  s.next() // l
  s.next() // l
  s.next() // o
  s.next() // !

  expect(s.index()).toBe(6)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(7)
  expect(s.currentChar()).toBe('\\')

  s.next() // \\, no newline

  expect(s.index()).toBe(7)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(8)
  expect(s.currentChar()).toBe('r')

  s.next() // r

  expect(s.index()).toBe(8)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(9)
  expect(s.currentChar()).toBe('\\')

  s.next() // \\, no newline

  expect(s.index()).toBe(9)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(10)
  expect(s.currentChar()).toBe('n')

  s.next() // こ
  s.next() // ん
  s.next() // に
  s.next() // ち
  s.next() // は
  s.next() // ！

  expect(s.index()).toBe(15)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(16)
  expect(s.currentChar()).toBe('！')
})

test('hello😺!\nこんにちは！', () => {
  const s = createScanner(`hello😺!\nこんにちは！`)
  s.next() // h
  s.next() // e
  s.next() // l
  s.next() // l
  s.next() // o

  expect(s.index()).toBe(5)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(6)

  s.peek() // emoji first code
  s.peek() // emoji last code (😺 is 2 length)
  s.peek() // !
  s.peek() // new line

  expect(s.index()).toBe(5)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(6)
  expect(s.peekOffset()).toBe(4)
  expect(s.currentPeek()).toBe('こ')

  s.skipToPeek()

  expect(s.index()).toBe(9)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(1)

  expect(s.currentChar()).toBe('こ')
})
