import { format } from '@intlify/shared'

import type { SourceLocation } from './location'

export const CompileWarnCodes = {
  USE_MODULO_SYNTAX: 1,
  __EXTEND_POINT__: 2
} as const

export interface CompileWarn {
  message: string
  code: number
  location?: SourceLocation
}

export type CompileWarnCodes =
  (typeof CompileWarnCodes)[keyof typeof CompileWarnCodes]

/** @internal */
export const warnMessages: { [code: number]: string } = {
  [CompileWarnCodes.USE_MODULO_SYNTAX]: `Use modulo before '{{0}}'.`
}

export function createCompileWarn<T extends number>(
  code: T,
  loc: SourceLocation | null,
  ...args: unknown[]
): CompileWarn {
  const msg = __DEV__ ? format(warnMessages[code] || '', ...(args || [])) : code
  const message: CompileWarn = { message: String(msg), code }
  if (loc) {
    message.location = loc
  }
  return message
}
