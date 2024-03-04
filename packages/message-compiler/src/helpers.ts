export const enum HelperNameMap {
  LIST = 'list',
  NAMED = 'named',
  PLURAL = 'plural',
  LINKED = 'linked',
  MESSAGE = 'message',
  TYPE = 'type',
  INTERPOLATE = 'interpolate',
  NORMALIZE = 'normalize',
  VALUES = 'values'
}

// eslint-disable-next-line no-useless-escape
const RE_HTML_TAG = /<\/?[\w\s="/.':;#-\/]+>/

export const detectHtmlTag = (source: string): boolean =>
  RE_HTML_TAG.test(source)
