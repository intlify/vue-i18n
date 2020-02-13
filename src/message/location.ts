import { RE_LINE_BREAK_GLOBAL } from './utils'

// The source range.
// The `start` is inclusive and `end` is exclusive.
// [start, end)
export interface SourceLocation {
  start: Position
  end: Position
  source?: string
}

export interface Position {
  offset: number // from start of content (file)
  line: number
  column: number
}

export function createPosition (line: number, column: number, offset: number) {
  return { line, column, offset } as Position
}

export function createLocation (start: Position, end: Position, source?: string) {
  return { start, end, source } as SourceLocation
}

export function getLineInfo (source: string, offset: number) {
  for (let line = 1, cur = 0;;) { // eslint-disable-line
    RE_LINE_BREAK_GLOBAL.lastIndex = cur
    const match = RE_LINE_BREAK_GLOBAL.exec(source)
    if (match && match.index < offset) {
      ++line
      cur = match.index + match[0].length
    } else {
      return createPosition(line, offset - cur, offset)
    }
  }
}
