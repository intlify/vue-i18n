import { createScanner } from '../../../src/message/scanner'

test('basic', () => {
  const s = createScanner(`hello!
こんにちは！`)

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('h')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.next() // h
  s.next() // e
  s.next() // l
  s.next() // l
  s.next() // o
  s.next() // !

  expect(s.index()).toBe(6)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(7)

  s.next() // new line, こ

  expect(s.currentChar()).toBe('こ')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(7)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(1)

  s.reset()
  s.peek() // h
  s.peek() // e
  s.peek() // l
  s.peek() // l
  s.peek() // o
  s.peek() // !

  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek() // new line, こ

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(7)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek()
  s.skipToPeek()

  expect(s.currentChar()).toBe('ん')
  expect(s.index()).toBe(8)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(2)
})

test('CRLF', () => {
  const s = createScanner(`hello!\r\nこんにちは！`)

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('h')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.next() // h
  s.next() // e
  s.next() // l
  s.next() // l
  s.next() // o
  s.next() // !

  expect(s.index()).toBe(6)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(7)

  s.next() // new line, こ

  expect(s.currentChar()).toBe('こ')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(8)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(1)

  s.reset()
  s.peek() // h
  s.peek() // e
  s.peek() // l
  s.peek() // l
  s.peek() // o
  s.peek() // !

  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek() // new line, こ

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(8)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek()
  s.skipToPeek()

  expect(s.currentChar()).toBe('ん')
  expect(s.index()).toBe(9)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(2)
})

test('LF', () => {
  const s = createScanner(`hello!\nこんにちは！`)

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('h')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.next() // h
  s.next() // e
  s.next() // l
  s.next() // l
  s.next() // o
  s.next() // !

  expect(s.index()).toBe(6)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(7)

  s.next() // new line, こ

  expect(s.currentChar()).toBe('こ')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(7)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(1)

  s.reset()
  s.peek() // h
  s.peek() // e
  s.peek() // l
  s.peek() // l
  s.peek() // o
  s.peek() // !

  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek() // new line, こ

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(7)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek()
  s.skipToPeek()

  expect(s.currentChar()).toBe('ん')
  expect(s.index()).toBe(8)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(2)
})

test('LS PS', () => {
  const s = createScanner(
    `hello!${String.fromCharCode(0x2028)}こんにちは！${String.fromCharCode(
      0x2029
    )}Hi!`
  )

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('h')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.next() // h
  s.next() // e
  s.next() // l
  s.next() // l
  s.next() // o
  s.next() // !

  expect(s.index()).toBe(6)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(7)

  s.next() // new line, こ

  expect(s.currentChar()).toBe('こ')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(7)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(1)

  s.reset()
  s.peek() // h
  s.peek() // e
  s.peek() // l
  s.peek() // l
  s.peek() // o
  s.peek() // !

  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek() // new line, こ

  expect(s.currentChar()).toBe('h')
  expect(s.currentPeek()).toBe('こ')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(7)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  s.peek()
  s.skipToPeek()

  expect(s.currentChar()).toBe('ん')
  expect(s.index()).toBe(8)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(2)
  expect(s.column()).toBe(2)

  s.next() // に
  s.next() // ち
  s.next() // は
  s.next() // ！
  s.next() // PS
  s.next() // H

  expect(s.currentChar()).toBe('H')
  expect(s.index()).toBe(14)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(3)
  expect(s.column()).toBe(1)
})
