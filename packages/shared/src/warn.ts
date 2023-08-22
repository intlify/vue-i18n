export function warn(msg: string, err?: Error): void {
  if (typeof console !== 'undefined') {
    console.warn(`[intlify] ` + msg)
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack)
    }
  }
}

const hasWarned: Record<string, boolean> = {}

export function warnOnce(msg: string) {
  if (!hasWarned[msg]) {
    hasWarned[msg] = true
    warn(msg)
  }
}
