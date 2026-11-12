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
// `xlink:href` is the older spelling of `href` on SVG elements, and an SVG `<a>` follows either of them
const urlAttributePattern = /^(?:href|xlink:href|src|action|formaction)$/i
const numericCharacterReferencePattern = /&#(?:x([0-9a-f]+)|(\d+));?/gi
const namedWhitespaceCharacterReferencePattern = /&(?:Tab|NewLine);/g
const colonCharacterReferencePattern = /&colon;?/gi
// oxlint-disable-next-line eslint/no-control-regex -- URL scheme normalization requires the full control range
const controlOrWhitespacePattern = /[\u0000-\u0020\u007f-\u009f]/g
const eventHandlerPattern = /^on\w/i
// `srcdoc` holds a whole HTML document: its value is entity-decoded and then parsed again,
// so neither escaping the value nor neutralizing `on*` inside it makes it inert
const srcdocPattern = /^srcdoc$/i
// `<base>` changes how the page resolves every relative URL after it, and SVG `<animate>` and `<set>`
// can set `href` of an SVG `<a>` through `values` or `to`, which the URL check does not look at.
// `<script>` does not run when inserted with `innerHTML`, but it runs when the HTML is rendered
// on the server (SSR) and the browser parses it as part of the page.
// `<plaintext>` turns the rest of the page into text
const dangerousElementPattern = /^(?:base|animate|set|script|plaintext)$/i
// The content of these elements is text up to their end tag when they are HTML elements, and markup when
// they are SVG or MathML elements. Their content is turned into text, so that it reads the same in both
const textContentElementPattern = /^(?:iframe|noembed|noframes|noscript|style|textarea|title|xmp)$/i
// The rules of the HTML tokenizer for tags, comments, and the end of a tag that is not closed (`$`):
// - `<` or `</`, and the tag name
const tagStartPattern = /<(\/?)([a-z][^\t\n\f\r />]*)/iy
// - whitespace and `/`, and then `>` or an attribute: its name, and its value in quotes or without quotes
const tagStepPattern =
  /([\t\n\f\r /]*)(?:(>)|([^\t\n\f\r />][^\t\n\f\r />=]*)(?:[\t\n\f\r ]*=[\t\n\f\r ]*(?:(["'])([\s\S]*?)(\4|$)|([^\t\n\f\r >]*)))?)/y
// - a comment, which ends with `-->` or `--!>`, or with `>` or `->` right after `<!--`
const commentPattern = /<!--(?:>|->|[\s\S]*?--!?>)/y

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

// What has been neutralized, for the warnings in development
interface Neutralized {
  eventHandler?: boolean
  srcdoc?: boolean
  element?: boolean
  unclosed?: boolean
}

function escapeLessThan(text: string): string {
  return text.replace(/</g, '&lt;')
}

function serializeAttribute(
  attrName: string,
  value: string | undefined,
  quote: string | undefined,
  neutralized: Neutralized
): string {
  // Character references are not decoded in attribute names, so escaping a character renames the attribute
  let name = attrName
  if (eventHandlerPattern.test(attrName)) {
    neutralized.eventHandler = true
    name = `&#111;n${attrName.slice(2)}`
  } else if (srcdocPattern.test(attrName)) {
    neutralized.srcdoc = true
    name = `&#115;${attrName.slice(1)}`
  }

  if (value === undefined) {
    return name
  }
  // An unquoted value stays unquoted: it has no whitespace or `>`, and escaping does not add them
  const valueQuote = quote || ''
  return `${name}=${valueQuote}${sanitizeAttributeValue(attrName, value)}${valueQuote}`
}

/**
 * Read a tag with the rules of the HTML tokenizer.
 * A start tag is written again with its attributes sanitized, and an end tag is kept as it is
 *
 * @param html - The HTML
 * @param start - The index of `<`
 * @param neutralized - What has been neutralized
 * @returns The tag, the tag name, and the index after the tag (-1 when the tag is not closed),
 * or `undefined` when `<` does not start a tag
 */
function readTag(
  html: string,
  start: number,
  neutralized: Neutralized
): [tag: string, tagName: string, end: number] | undefined {
  tagStartPattern.lastIndex = start
  const tagStart = tagStartPattern.exec(html)
  if (!tagStart) {
    return
  }

  const [, slash, tagName] = tagStart
  let tag = tagStart[0]
  let step: RegExpExecArray | null
  tagStepPattern.lastIndex = tagStartPattern.lastIndex
  while ((step = tagStepPattern.exec(html))) {
    const [raw, separator, close, attrName, quote, quotedValue, closingQuote, unquotedValue] = step
    if (close) {
      const end = tagStepPattern.lastIndex
      // browsers ignore the attributes of end tags
      return [slash ? html.slice(start, end) : tag + raw, tagName, end]
    }
    if (quote && !closingQuote) {
      break
    }
    if (!slash) {
      const value = quote ? quotedValue : unquotedValue
      tag += separator + serializeAttribute(attrName, value, quote, neutralized)
    }
  }

  return [tag, tagName, -1]
}

/**
 * Find the end tag of an element whose content is text, as the HTML tokenizer does:
 * the first `</` followed by the tag name, and by whitespace, `/` or `>`
 *
 * @returns The index of the end tag, or -1 when it is not found or not closed in the string
 */
function findTextContentEnd(html: string, from: number, tagName: string): number {
  for (let index = html.indexOf('</', from); index !== -1; index = html.indexOf('</', index + 2)) {
    const endTag = readTag(html, index, {})
    if (endTag && endTag[1].toLowerCase() === tagName.toLowerCase()) {
      return endTag[2] === -1 ? -1 : index
    }
  }
  return -1
}

/**
 * Sanitize the translated HTML
 *
 * @remarks
 * Tags are read with the rules of the HTML tokenizer, so that the sanitizer and browsers agree on
 * where each tag and each attribute starts and ends, and every attribute of every start tag is checked.
 * What is still open at the end of the string (a tag, a comment, or an element whose content is text,
 * like `<textarea>`) becomes text: on the server (SSR), the rest of the page follows the translation,
 * and it would be read as a part of what is open
 *
 * @param html - The translated HTML
 * @returns The sanitized HTML
 */
export function sanitizeTranslatedHtml(html: string): string {
  const neutralized: Neutralized = {}
  let result = ''
  let index = 0
  let lessThan: number

  while ((lessThan = html.indexOf('<', index)) !== -1) {
    result += html.slice(index, lessThan)
    index = lessThan + 1

    const read = readTag(html, lessThan, neutralized)
    if (read) {
      const [tag, tagName, end] = read
      if (end === -1) {
        neutralized.unclosed = true
        result += escapeLessThan(html.slice(lessThan))
        index = html.length
        break
      }
      index = end

      if (tag[1] === '/') {
        result += tag
      } else if (dangerousElementPattern.test(tagName)) {
        // the start tag becomes text
        neutralized.element = true
        result += escapeLessThan(tag)
      } else if (textContentElementPattern.test(tagName)) {
        const contentEnd = findTextContentEnd(html, end, tagName)
        if (contentEnd === -1) {
          // the start tag becomes text, and the content is read as HTML, as browsers do then
          neutralized.unclosed = true
          result += escapeLessThan(tag)
        } else {
          result += tag + escapeLessThan(html.slice(end, contentEnd))
          index = contentEnd
        }
      } else {
        result += tag
      }
      continue
    }

    commentPattern.lastIndex = lessThan
    if (commentPattern.test(html)) {
      result += html.slice(lessThan, commentPattern.lastIndex)
      index = commentPattern.lastIndex
      continue
    }
    if (html.startsWith('<!--', lessThan)) {
      neutralized.unclosed = true
    }
    // `<!DOCTYPE`, `<![CDATA[`, `<?`, `</` without a tag name, `<` at the end and any other `<` become text
    result += '&lt;'
  }
  result += html.slice(index)

  if (__DEV__) {
    if (neutralized.eventHandler) {
      warn(
        'Potentially dangerous event handlers detected in translation. ' +
          'Consider removing onclick, onerror, etc. from your translation messages.'
      )
    }
    if (neutralized.srcdoc) {
      warn(
        'Potentially dangerous srcdoc attribute detected in translation. ' +
          'Consider removing srcdoc from your translation messages.'
      )
    }
    if (neutralized.element) {
      warn(
        'Potentially dangerous element (<base>, <animate>, <set>, <script> or <plaintext>) ' +
          'detected in translation. Consider removing it from your translation messages.'
      )
    }
    if (neutralized.unclosed) {
      warn(
        'Unclosed tag, comment or element (such as <textarea>) detected in translation. ' +
          'Consider closing it in your translation messages.'
      )
    }
  }

  return result
}
