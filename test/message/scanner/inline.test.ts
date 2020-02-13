import { createScanner } from '../../../src/message/scanner'

test('next', () => {
  const s = createScanner('abcd')

  expect(s.currentChar()).toBe('a')
  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  expect(s.next()).toBe('b')
  expect(s.currentChar()).toBe('b')
  expect(s.index()).toBe(1)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)

  expect(s.next()).toBe('c')
  expect(s.currentChar()).toBe('c')
  expect(s.index()).toBe(2)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(3)

  expect(s.next()).toBe('d')
  expect(s.currentChar()).toBe('d')
  expect(s.index()).toBe(3)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(4)

  expect(s.next()).toBeUndefined()
  expect(s.currentChar()).toBeUndefined()
  expect(s.index()).toBe(4)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(5)
})

test('peek', () => {
  const s = createScanner('abcd')

  expect(s.currentPeek()).toBe('a')
  expect(s.peekOffset()).toBe(0)
  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  expect(s.peek()).toBe('b')
  expect(s.currentPeek()).toBe('b')
  expect(s.peekOffset()).toBe(1)
  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  expect(s.peek()).toBe('c')
  expect(s.currentPeek()).toBe('c')
  expect(s.peekOffset()).toBe(2)
  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  expect(s.peek()).toBe('d')
  expect(s.currentPeek()).toBe('d')
  expect(s.peekOffset()).toBe(3)
  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  expect(s.peek()).toBeUndefined()
  expect(s.currentPeek()).toBeUndefined()
  expect(s.peekOffset()).toBe(4)
  expect(s.index()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)
})

test('skip to peek', () => {
  const s = createScanner('abcd')

  s.peek()
  s.peek()
  s.skipToPeek()

  expect(s.currentChar()).toBe('c')
  expect(s.currentPeek()).toBe('c')
  expect(s.peekOffset()).toBe(0)
  expect(s.index()).toBe(2)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(3)

  s.peek()

  expect(s.currentChar()).toBe('c')
  expect(s.currentPeek()).toBe('d')
  expect(s.peekOffset()).toBe(1)
  expect(s.index()).toBe(2)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(3)

  s.next()

  expect(s.currentChar()).toBe('d')
  expect(s.currentPeek()).toBe('d')
  expect(s.peekOffset()).toBe(0)
  expect(s.index()).toBe(3)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(4)
})

test('reset peek', () => {
  const s = createScanner('abcd')

  s.next()
  s.peek()
  s.peek()
  s.resetPeek()

  expect(s.currentChar()).toBe('b')
  expect(s.currentPeek()).toBe('b')
  expect(s.peekOffset()).toBe(0)
  expect(s.index()).toBe(1)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)

  s.peek()

  expect(s.currentChar()).toBe('b')
  expect(s.currentPeek()).toBe('c')
  expect(s.peekOffset()).toBe(1)
  expect(s.index()).toBe(1)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)

  s.peek()
  s.peek()
  s.peek()
  s.resetPeek(0)

  expect(s.currentChar()).toBe('b')
  expect(s.currentPeek()).toBe('b')
  expect(s.peekOffset()).toBe(0)
  expect(s.index()).toBe(1)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)

  expect(s.peek()).toBe('c')
  expect(s.currentChar()).toBe('b')
  expect(s.currentPeek()).toBe('c')
  expect(s.peekOffset()).toBe(1)
  expect(s.index()).toBe(1)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)

  expect(s.peek()).toBe('d')
  expect(s.peek()).toBeUndefined()
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)
})

test('none ascii', () => {
  const s = createScanner('あいうえお')

  expect(s.currentChar()).toBe('あ')
  expect(s.currentPeek()).toBe('あ')
  expect(s.index()).toBe(0)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(1)

  expect(s.next()).toBe('い')
  expect(s.currentChar()).toBe('い')
  expect(s.currentPeek()).toBe('い')
  expect(s.index()).toBe(1)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)

  expect(s.peek()).toBe('う')
  expect(s.currentChar()).toBe('い')
  expect(s.currentPeek()).toBe('う')
  expect(s.index()).toBe(1)
  expect(s.peekOffset()).toBe(1)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(2)

  s.skipToPeek()

  expect(s.currentChar()).toBe('う')
  expect(s.currentPeek()).toBe('う')
  expect(s.index()).toBe(2)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(3)

  s.peek()
  s.peek()

  expect(s.currentChar()).toBe('う')
  expect(s.currentPeek()).toBe('お')
  expect(s.index()).toBe(2)
  expect(s.peekOffset()).toBe(2)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(3)

  expect(s.peek()).toBeUndefined()
  expect(s.currentChar()).toBe('う')
  expect(s.currentPeek()).toBeUndefined()
  expect(s.index()).toBe(2)
  expect(s.peekOffset()).toBe(3)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(3)

  s.resetPeek()

  expect(s.currentChar()).toBe('う')
  expect(s.currentPeek()).toBe('う')
  expect(s.index()).toBe(2)
  expect(s.peekOffset()).toBe(0)
  expect(s.line()).toBe(1)
  expect(s.column()).toBe(3)
})
