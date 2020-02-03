type Scanner = Readonly<{
  index: () => number
  line: () => number
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

const CHAR_CR = '\r'
const CHAR_LF = '\n'
const CHAR_LS = String.fromCharCode(0x2028)
const CHAR_PS = String.fromCharCode(0x2029)

export function createScanner (str: string): Scanner {
  const _buf = str
  let _index = 0
  let _line = 1
  let _lineStart = _index
  let _peekOffset = 0

  const isCRLF = (index: number) => _buf[index] === CHAR_CR && _buf[index + 1] === CHAR_LF
  const isLF = (index: number) => _buf[index] === CHAR_LF
  const isPS = (index: number) => _buf[index] === CHAR_PS
  const isLS = (index: number) => _buf[index] === CHAR_LS
  const isLineEnd = (index: number) => isCRLF(index) || isLF(index) || isPS(index) || isLS(index)

  const index = () => _index
  const line = () => _line
  const peekOffset = () => _peekOffset

  function charAt (offset: number) {
    if (isCRLF(offset)) {
      return CHAR_LF
    }
    return _buf[offset]
  }

  const currentChar = () => charAt(_index)
  const currentPeek = () => charAt(_index + _peekOffset)

  function next () {
    _peekOffset = 0
    if (isCRLF(_index)) {
      _index++
    }
    _index++
    return _buf[_index]
  }

  function peek () {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++
    }
    _peekOffset++
    return _buf[_index + _peekOffset]
  }

  function reset () {
    _index = 0
    _peekOffset = 0
  }

  function resetPeek (offset = 0) {
    _peekOffset = offset
  }

  function skipToPeek () {
    _index += _peekOffset
    _peekOffset = 0
  }

  return Object.freeze({
    index, line, peekOffset, charAt, currentChar, currentPeek,
    next, peek, reset, resetPeek, skipToPeek
  })
}
