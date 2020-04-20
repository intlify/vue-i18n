import { isUnDef } from '../utils'

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

export function createPosition(line: number, column: number, offset: number) {
  return { line, column, offset } as Position
}

export function createLocation(
  start: Position,
  end: Position,
  source?: string
) {
  const loc = { start, end } as SourceLocation
  if (!isUnDef(source)) {
    loc.source = source
  }
  return loc
}
