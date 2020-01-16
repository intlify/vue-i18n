type Scanner = Readonly<{
  index: number
  buf: string
  peekOffset: number
  charAt: (offset: number) => string
  currentChar: () => string
  currentPeek: () => string
  next: () => string
  peek: () => string
  resetPeek: (offset: number) => void
  skipToPeek: () => void
}>

export function createScanner (str: string): Scanner {
  const buf = str
  let index = 0
  let peekOffset = 0

  function charAt (offset: number) {
    if (buf[offset] === '\r' &&
        buf[offset + 1] === '\n') {
      return '\n'
    }
    return buf[offset]
  }

  function currentChar () {
    return charAt(index)
  }

  function currentPeek () {
    return charAt(index + peekOffset)
  }

  function next () {
    peekOffset = 0
    if (buf[index] === '\r' &&
        buf[index + 1] === '\n') {
      index++
    }
    index++
    return buf[index]
  }

  function peek () {
    if (buf[index + peekOffset] === '\r' &&
        buf[index + peekOffset + 1] === '\n') {
      peekOffset++
    }
    peekOffset++
    return buf[index + peekOffset]
  }

  function resetPeek (offset = 0) {
    peekOffset = offset
  }

  function skipToPeek () {
    index += peekOffset
    peekOffset = 0
  }

  const scanner = {
    charAt, currentChar, currentPeek,
    next, peek, resetPeek, skipToPeek
  }

  const getters: { [key: string]: () => unknown } = {
    index () { return index },
    buf () { return buf },
    peekOffset () { return peekOffset }
  }
  const props = Object.keys(getters)

  const handler: ProxyHandler<Scanner> = {
    set (/* target, prop, value, receiver */) {
      throw new TypeError(`prop setter is not allowed`)
    },
    get (target, prop/* , receiver*/) {
      if (typeof prop !== 'string') {
        throw new TypeError('invalid prop getter')
      }
      if (props.includes(prop)) {
        return getters[prop]()
      } else {
        throw new TypeError(`'${prop}' prop getting is not allowed`)
      }
    }
  }

  return new Proxy<Scanner>(scanner as Scanner, handler)
}
