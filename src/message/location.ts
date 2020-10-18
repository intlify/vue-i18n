// The source range.
// The `start` is inclusive and `end` is exclusive.
// [start, end)
export interface SourceLocation {
  start: Position
  end: Position
  source?: string
}

export const LocationStub: SourceLocation = {
  start: { line: 1, column: 1, offset: 0 },
  end: { line: 1, column: 1, offset: 0 }
}

export interface Position {
  offset: number // from start of content (file)
  line: number
  column: number
}

export function createPosition(
  line: number,
  column: number,
  offset: number
): Position {
  return { line, column, offset } as Position
}

export function createLocation(
  start: Position,
  end: Position,
  source?: string
): SourceLocation {
  const loc = { start, end } as SourceLocation
  if (source != null) {
    loc.source = source
  }
  return loc
}
