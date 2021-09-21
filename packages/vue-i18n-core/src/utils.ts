// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function isLegacyVueI18n(VueI18n: any): boolean {
  if (VueI18n == null || VueI18n.version == null) {
    return false
  }
  return (Number(VueI18n.version.split('.')[0]) || -1) >= 8
}
