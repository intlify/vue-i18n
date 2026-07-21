import { warn } from './warn'

export function escapeHtml(rawText: string): string {
  return rawText
    .replace(/&/g, '&amp;') // escape `&` first to avoid double escaping
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\//g, '&#x2F;') // escape `/` to prevent closing tags or JavaScript URLs
    .replace(/=/g, '&#x3D;') // escape `=` to prevent attribute injection
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&(?![a-z0-9#]{2,6};)/gi, '&amp;') // escape unescaped `&`
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const javascriptSchemePattern = /^javascript:/i
const urlAttributePattern = /^(?:href|src|action|formaction)$/i
const numericCharacterReferencePattern = /&#(?:x([0-9a-f]+)|(\d+));?/gi
const namedWhitespaceCharacterReferencePattern = /&(?:Tab|NewLine);/g
const colonCharacterReferencePattern = /&colon;?/gi
// oxlint-disable-next-line eslint/no-control-regex -- URL scheme normalization requires the full control range
const controlOrWhitespacePattern = /[\u0000-\u0020\u007f-\u009f]/g
const eventHandlerPattern = /(?:^|[\s"'<>/])on\w+\s*=\s*["']?[^"'>]+["']?/i
const eventHandlerAttributePattern = /(^|[\s"'<>/])on(\w+\s*=)/gi
const unquotedUrlAttributePattern =
  /(^|[\s"'<>/])((?:href|src|action|formaction)\s*=\s*)([^\s"'=<>`]+)/gi

function decodeNumericCharacterReference(
  match: string,
  hex: string | undefined,
  decimal: string | undefined
): string {
  const digits = hex || decimal
  if (!digits) {
    return match
  }

  const codePoint = Number.parseInt(digits, hex ? 16 : 10)
  return codePoint <= 0x7f ? String.fromCharCode(codePoint) : match
}

function hasJavascriptScheme(value: string): boolean {
  const normalized = value
    .replace(numericCharacterReferencePattern, decodeNumericCharacterReference)
    .replace(namedWhitespaceCharacterReferencePattern, '')
    .replace(colonCharacterReferencePattern, ':')
    .replace(controlOrWhitespacePattern, '')

  return javascriptSchemePattern.test(normalized)
}

function sanitizeStyleValue(value: string): string {
  const urlPattern = /url\s*\(/gi
  let sanitized = ''
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = urlPattern.exec(value)) !== null) {
    const urlStart = match.index
    const openParenIndex = urlPattern.lastIndex - 1
    let index = openParenIndex + 1
    let depth = 1
    let quote: '"' | "'" | null = null

    for (; index < value.length; index++) {
      const char = value[index]

      if (quote) {
        if (char === quote) {
          quote = null
        }
        continue
      }

      if (char === '"' || char === "'") {
        quote = char
      } else if (char === '(') {
        depth++
      } else if (char === ')') {
        depth--
        if (depth === 0) {
          break
        }
      }
    }

    if (depth !== 0) {
      break
    }

    const rawUrlValue = value.slice(openParenIndex + 1, index).trim()
    const unquotedUrlValue =
      (rawUrlValue.startsWith('"') && rawUrlValue.endsWith('"')) ||
      (rawUrlValue.startsWith("'") && rawUrlValue.endsWith("'"))
        ? rawUrlValue.slice(1, -1).trim()
        : rawUrlValue

    sanitized += value.slice(cursor, urlStart)
    sanitized += hasJavascriptScheme(unquotedUrlValue)
      ? 'url(about:blank)'
      : value.slice(urlStart, index + 1)
    cursor = index + 1
  }

  return sanitized + value.slice(cursor)
}

function sanitizeAttributeValue(attrName: string, value: string): string {
  if (urlAttributePattern.test(attrName) && hasJavascriptScheme(value)) {
    return 'about:blank'
  }

  const sanitizedValue = attrName.toLowerCase() === 'style' ? sanitizeStyleValue(value) : value

  return escapeAttributeValue(sanitizedValue)
}

export function sanitizeTranslatedHtml(html: string): string {
  // Escape dangerous characters in attribute values
  // Process attributes with double quotes
  html = html.replace(
    /([\w:-]+)\s*=\s*"([^"]*)"/g,
    (_, attrName, attrValue) => `${attrName}="${sanitizeAttributeValue(attrName, attrValue)}"`
  )

  // Process attributes with single quotes
  html = html.replace(
    /([\w:-]+)\s*=\s*'([^']*)'/g,
    (_, attrName, attrValue) => `${attrName}='${sanitizeAttributeValue(attrName, attrValue)}'`
  )

  // Detect and neutralize event handler attributes
  if (eventHandlerPattern.test(html)) {
    if (__DEV__) {
      warn(
        'Potentially dangerous event handlers detected in translation. ' +
          'Consider removing onclick, onerror, etc. from your translation messages.'
      )
    }
    // Neutralize event handler attributes by escaping 'on'
    html = html.replace(eventHandlerAttributePattern, '$1&#111;n$2')
  }

  // Disable javascript: URLs in unquoted attributes
  html = html.replace(unquotedUrlAttributePattern, (match, boundary, prefix, attrValue) =>
    hasJavascriptScheme(attrValue) ? `${boundary}${prefix}about:blank` : match
  )

  return html
}
