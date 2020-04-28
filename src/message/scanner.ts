export type Scanner = Readonly<{
  index: () => number
  line: () => number
  column: () => number
  peekOffset: () => number
  charAt: (offset: number) => string
  currentChar: () => string
  currentPeek: () => string
  next: () => string
  peek: () => string
  reset: () => void
  resetPeek: (offset?: number) => void
  skipToPeek: () => void
}>

export const CHAR_SP = ' '
export const CHAR_CR = '\r'
export const CHAR_LF = '\n'
export const CHAR_LS = String.fromCharCode(0x2028)
export const CHAR_PS = String.fromCharCode(0x2029)

export function createScanner(str: string): Scanner {
  const _buf = str
  let _index = 0
  let _line = 1
  let _column = 1
  let _peekOffset = 0

  const isCRLF = (index: number): boolean =>
    _buf[index] === CHAR_CR && _buf[index + 1] === CHAR_LF
  const isLF = (index: number): boolean => _buf[index] === CHAR_LF
  const isPS = (index: number): boolean => _buf[index] === CHAR_PS
  const isLS = (index: number): boolean => _buf[index] === CHAR_LS
  const isLineEnd = (index: number): boolean =>
    isCRLF(index) || isLF(index) || isPS(index) || isLS(index)

  const index = (): number => _index
  const line = (): number => _line
  const column = (): number => _column
  const peekOffset = (): number => _peekOffset

  function charAt(offset: number): string {
    if (isCRLF(offset) || isPS(offset) || isLS(offset)) {
      return CHAR_LF
    }
    return _buf[offset]
  }

  const currentChar = (): string => charAt(_index)
  const currentPeek = (): string => charAt(_index + _peekOffset)

  function next(): string {
    _peekOffset = 0
    if (isLineEnd(_index)) {
      _line++
      _column = 0
    }
    if (isCRLF(_index)) {
      _index++
    }
    _index++
    _column++
    return _buf[_index]
  }

  function peek(): string {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++
    }
    _peekOffset++
    return _buf[_index + _peekOffset]
  }

  function reset(): void {
    _index = 0
    _line = 1
    _column = 1
    _peekOffset = 0
  }

  function resetPeek(offset = 0): void {
    _peekOffset = offset
  }

  function skipToPeek(): void {
    const target = _index + _peekOffset
    while (target !== _index) {
      next()
    }
    _peekOffset = 0
  }

  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  }
}
