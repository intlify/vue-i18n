/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isLegacyVueI18n(VueI18n: any): boolean {
  if (VueI18n == null || VueI18n.version == null) {
    return false
  }
  return (Number(VueI18n.version.split('.')[0]) || -1) >= 8
}

export function merge(
  source: Record<string, any>,
  target: Record<string, any>
): Record<string, any> {
  return Object.assign({}, target, source)
}

/* eslint-enable @typescript-eslint/no-explicit-any */
