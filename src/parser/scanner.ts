type Scanner = Readonly<{
  index: () => number
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

export function createScanner (str: string): Scanner {
  const _buf = str
  let _index = 0
  let _peekOffset = 0

  const index = () => _index
  const peekOffset = () => _peekOffset

  function charAt (offset: number) {
    if (_buf[offset] === '\r' &&
        _buf[offset + 1] === '\n') {
      return '\n'
    }
    return _buf[offset]
  }

  const currentChar = () => charAt(_index)
  const currentPeek = () => charAt(_index + _peekOffset)

  function next () {
    _peekOffset = 0
    if (_buf[_index] === '\r' &&
        _buf[_index + 1] === '\n') {
      _index++
    }
    _index++
    return _buf[_index]
  }

  function peek () {
    if (_buf[_index + _peekOffset] === '\r' &&
        _buf[_index + _peekOffset + 1] === '\n') {
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
    index, peekOffset, charAt, currentChar, currentPeek,
    next, peek, reset, resetPeek, skipToPeek
  })
}
