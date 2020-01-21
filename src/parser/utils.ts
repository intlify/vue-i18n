export const RE_LINE_BREAK = /\r\n?|\n|\u2028|\u2029/
export const RE_LINE_BREAK_GLOBAL = new RegExp(RE_LINE_BREAK.source, 'g')

export function isNewLine (code: number) {
  return code === 0x10 || code === 0x1D || code === 0x2028 || code === 0x2029
}

export const nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/
export const skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g
