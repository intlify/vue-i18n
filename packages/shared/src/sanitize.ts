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
  closed?: boolean
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

const HTML = 0
const SVG = 1
const MATHML = 2

/**
 * An element that the translation opens, as the tree builder of browsers reads it
 */
interface OpenElement {
  // the tag name in ASCII lowercase
  name: string
  namespace: number
  // the start tags in it are read with the HTML rules: SVG `<foreignObject>`, `<desc>` and `<title>`, and
  // MathML `<annotation-xml>` whose encoding is HTML, and (except `<mglyph>` and `<malignmark>`)
  // MathML `<mi>`, `<mo>`, `<mn>`, `<ms>` and `<mtext>`
  integration: boolean
  // the index of the start tag in the result
  part: number
}

// Elements that have no end tag, and elements that the HTML parser does not open in the body
const notOpenedElementPattern =
  /^(?:area|base|basefont|bgsound|br|col|embed|frame|hr|image|img|input|keygen|link|meta|param|source|track|wbr|html|head|body|frameset)$/
// Start tags that end SVG and MathML content (and `<font>` with `color`, `face` or `size`)
const breakoutElementPattern =
  /^(?:[bipsu]|big|blockquote|body|br|center|code|dd|div|dl|dt|em|embed|h[1-6]|head|hr|img|li|listing|menu|meta|nobr|ol|pre|ruby|small|span|strong|strike|sub|sup|table|tt|ul|var)$/
// Start tags that close an open `<p>`, and the elements that they do not close a `<p>` through
const paragraphClosingElementPattern =
  /^(?:address|article|aside|blockquote|center|details|dialog|dir|div|dl|fieldset|figcaption|figure|footer|header|hgroup|main|menu|nav|ol|p|search|section|summary|ul|h[1-6]|pre|listing|form|li|dd|dt|plaintext|table|hr|xmp)$/
const buttonScopeElementPattern =
  /^(?:applet|caption|html|table|td|th|marquee|object|template|button)$/
const svgIntegrationPattern = /^(?:foreignobject|desc|title)$/
// The names of SVG and MathML integration points (except `title`, whose content is text in HTML). Read with the
// HTML rules, they are unknown HTML elements, and their start tags become text: if the browser closed such an
// element early (for example, `<button>` of the translation closes the `<button>` that the translation is
// rendered in), its end tag would close an integration point of the page, and the rest of the page would be read
// as SVG or MathML
const integrationNamePattern = /^(?:foreignobject|desc|mi|mo|mn|ms|mtext|annotation-xml)$/
const mathmlIntegrationPattern = /^(?:mi|mo|mn|ms|mtext)$/
const htmlEncodingPattern = /^(?:text\/html|application\/xhtml\+xml)$/i

function asciiLowercase(text: string): string {
  return text.replace(/[A-Z]+/g, upper => upper.toLowerCase())
}

// Whether a start tag is read with the rules of SVG and MathML content, rather than with the HTML rules
function isForeignContext(top: OpenElement | undefined, name: string): boolean {
  return (
    !!top &&
    top.namespace !== HTML &&
    (!top.integration ||
      (mathmlIntegrationPattern.test(top.name) && (name === 'mglyph' || name === 'malignmark'))) &&
    !(top.name === 'annotation-xml' && name === 'svg')
  )
}

function isBreakout(name: string, attributes: Map<string, string>): boolean {
  return (
    breakoutElementPattern.test(name) ||
    (name === 'font' &&
      (attributes.has('color') || attributes.has('face') || attributes.has('size')))
  )
}

// Pop the elements down to `length`, and return their end tags (innermost first).
// A `<form>` becomes text instead: in a form of the page, browsers ignore the `<form>`,
// and `</form>` would close the form of the page
function closeDownTo(stack: OpenElement[], length: number, parts: string[]): string {
  let endTags = ''
  for (let index = stack.length - 1; index >= length; index--) {
    const element = stack[index]
    if (element.namespace === HTML && element.name === 'form') {
      parts[element.part] = escapeLessThan(parts[element.part])
    } else {
      endTags += `</${element.name}>`
    }
  }
  stack.length = length
  return endTags
}

// Pop SVG and MathML elements down to an HTML element or an integration point, as the tree builder does,
// and return their end tags
function closeForeign(stack: OpenElement[], parts: string[]): string {
  let length = stack.length
  while (length > 0 && stack[length - 1].namespace !== HTML && !stack[length - 1].integration) {
    length--
  }
  return closeDownTo(stack, length, parts)
}

/**
 * Open an element for a start tag, as the tree builder does
 *
 * @returns The end tags to write before the start tag: the SVG and MathML elements that it ends, and a `<p>`
 * of the translation that it closes, with the elements in the `<p>` (so that no formatting element in it is
 * made again after it), or `undefined` when the start tag becomes text
 */
function openElement(
  stack: OpenElement[],
  parts: string[],
  name: string,
  attributes: Map<string, string>,
  selfClosing: boolean
): string | undefined {
  // the start tag is written after the end tags
  const part = parts.length + 1
  let endTags = ''
  const top = stack[stack.length - 1]
  if (isForeignContext(top, name)) {
    if (!isBreakout(name, attributes)) {
      if (!selfClosing) {
        stack.push({
          name,
          namespace: top!.namespace,
          integration:
            top!.namespace === SVG
              ? svgIntegrationPattern.test(name)
              : mathmlIntegrationPattern.test(name) ||
                (name === 'annotation-xml' &&
                  htmlEncodingPattern.test(
                    (attributes.get('encoding') || '').replace(
                      numericCharacterReferencePattern,
                      decodeNumericCharacterReference
                    )
                  )),
          part
        })
      }
      return endTags
    }
    endTags = closeForeign(stack, parts)
  }
  if (paragraphClosingElementPattern.test(name)) {
    for (let index = stack.length - 1; index >= 0; index--) {
      const element = stack[index]
      if (
        element.namespace === HTML
          ? buttonScopeElementPattern.test(element.name)
          : element.integration
      ) {
        break
      }
      if (element.namespace === HTML && element.name === 'p') {
        endTags += closeDownTo(stack, index, parts)
        break
      }
    }
  }
  if (integrationNamePattern.test(name)) {
    return
  }
  if (name === 'svg' || name === 'math') {
    if (!selfClosing) {
      stack.push({ name, namespace: name === 'svg' ? SVG : MATHML, integration: false, part })
    }
  } else if (!notOpenedElementPattern.test(name)) {
    // HTML elements ignore `/>`
    stack.push({ name, namespace: HTML, integration: false, part })
  }
  return endTags
}

/**
 * Close the element of an end tag: an SVG or MathML element with the same name above the innermost HTML
 * element, or else an HTML element with the same name
 *
 * @returns The end tags to write before the end tag (of the elements in the closed element), or `undefined`
 * when the end tag closes nothing in the translation, and is removed
 */
function closeElement(stack: OpenElement[], parts: string[], name: string): string | undefined {
  let endTags = ''
  if (name === 'p' || name === 'br') {
    // they end SVG and MathML content
    endTags = closeForeign(stack, parts)
  }
  let index = stack.length - 1
  while (index >= 0 && stack[index].namespace !== HTML && stack[index].name !== name) {
    index--
  }
  if (index >= 0 && stack[index].namespace !== HTML) {
    // an SVG or MathML element
  } else {
    while (index >= 0 && !(stack[index].namespace === HTML && stack[index].name === name)) {
      index--
    }
  }
  if (index < 0) {
    // browsers read `</br>` as `<br>`, and `</p>` without an open `<p>` as `<p></p>`
    return name === 'br' || name === 'p' ? endTags : undefined
  }
  endTags += closeDownTo(stack, index + 1, parts)
  stack.length = index
  return endTags
}

/**
 * Read a tag with the rules of the HTML tokenizer.
 * A start tag is written again with its attributes sanitized, and an end tag is kept as it is
 *
 * @param html - The HTML
 * @param start - The index of `<`
 * @param neutralized - What has been neutralized
 * @returns The tag, the tag name, the index after the tag (-1 when the tag is not closed),
 * whether the start tag is self-closing (`/>`), and the attributes of the start tag,
 * or `undefined` when `<` does not start a tag
 */
function readTag(
  html: string,
  start: number,
  neutralized: Neutralized
):
  | [
      tag: string,
      tagName: string,
      end: number,
      selfClosing: boolean,
      attributes: Map<string, string>
    ]
  | undefined {
  tagStartPattern.lastIndex = start
  const tagStart = tagStartPattern.exec(html)
  if (!tagStart) {
    return
  }

  const [, slash, tagName] = tagStart
  let tag = tagStart[0]
  const attributes = new Map<string, string>()
  let step: RegExpExecArray | null
  tagStepPattern.lastIndex = tagStartPattern.lastIndex
  while ((step = tagStepPattern.exec(html))) {
    const [raw, separator, close, attrName, quote, quotedValue, closingQuote, unquotedValue] = step
    if (close) {
      const end = tagStepPattern.lastIndex
      // browsers ignore the attributes of end tags
      return [
        slash ? html.slice(start, end) : tag + raw,
        tagName,
        end,
        !slash && separator.endsWith('/'),
        attributes
      ]
    }
    if (quote && !closingQuote) {
      break
    }
    if (!slash) {
      const value = quote ? quotedValue : unquotedValue
      const name = asciiLowercase(attrName)
      if (!attributes.has(name)) {
        attributes.set(name, value || '')
      }
      tag += separator + serializeAttribute(attrName, value, quote, neutralized)
    }
  }

  return [tag, tagName, -1, false, attributes]
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
 * and it would be read as a part of what is open.
 * For the same reason, the elements are followed as the tree builder of browsers opens and closes them,
 * including SVG and MathML: an end tag that closes no element of the translation is removed, the elements
 * in the element that an end tag closes are closed before it, and the elements still open at the end are
 * closed. A `<form>` that the translation does not close becomes text, because browsers ignore it in a form
 * of the page, and `</form>` would close that form
 *
 * @param html - The translated HTML
 * @returns The sanitized HTML
 */
export function sanitizeTranslatedHtml(html: string): string {
  const neutralized: Neutralized = {}
  const parts: string[] = []
  const stack: OpenElement[] = []
  let index = 0
  let lessThan: number

  while ((lessThan = html.indexOf('<', index)) !== -1) {
    parts.push(html.slice(index, lessThan))
    index = lessThan + 1

    const read = readTag(html, lessThan, neutralized)
    if (read) {
      const [tag, tagName, end, selfClosing, attributes] = read
      if (end === -1) {
        neutralized.unclosed = true
        parts.push(escapeLessThan(html.slice(lessThan)))
        index = html.length
        break
      }
      index = end

      if (tag[1] === '/') {
        const endTags = closeElement(stack, parts, asciiLowercase(tagName))
        if (endTags === undefined) {
          neutralized.closed = true
        } else {
          if (endTags) {
            neutralized.closed = true
          }
          parts.push(endTags + tag)
        }
      } else if (dangerousElementPattern.test(tagName)) {
        // the start tag becomes text
        neutralized.element = true
        parts.push(escapeLessThan(tag))
      } else {
        let content = ''
        if (textContentElementPattern.test(tagName)) {
          const contentEnd = findTextContentEnd(html, end, tagName)
          if (contentEnd === -1) {
            // the start tag becomes text, and the content is read as HTML, as browsers do then
            neutralized.unclosed = true
            parts.push(escapeLessThan(tag))
            continue
          }
          content = escapeLessThan(html.slice(end, contentEnd))
          index = contentEnd
        }
        const endTags = openElement(stack, parts, asciiLowercase(tagName), attributes, selfClosing)
        if (endTags === undefined) {
          neutralized.closed = true
          parts.push(escapeLessThan(tag) + content)
        } else {
          parts.push(endTags, tag + content)
        }
      }
      continue
    }

    commentPattern.lastIndex = lessThan
    if (commentPattern.test(html)) {
      parts.push(html.slice(lessThan, commentPattern.lastIndex))
      index = commentPattern.lastIndex
      continue
    }
    if (html.startsWith('<!--', lessThan)) {
      neutralized.unclosed = true
    }
    // `<!DOCTYPE`, `<![CDATA[`, `<?`, `</` without a tag name, `<` at the end and any other `<` become text
    parts.push('&lt;')
  }
  parts.push(html.slice(index))

  // close the elements that are still open
  for (let open = stack.length - 1; open >= 0; open--) {
    const element = stack[open]
    neutralized.closed = true
    if (element.namespace === HTML && element.name === 'form') {
      // the browser ignores `<form>` in a form of the page, and `</form>` would close that form
      parts[element.part] = escapeLessThan(parts[element.part])
    } else {
      parts.push(`</${element.name}>`)
    }
  }

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
    if (neutralized.closed) {
      warn(
        'Unclosed or misnested elements detected in translation. ' +
          'Consider closing every element in the right order in your translation messages.'
      )
    }
  }

  return parts.join('')
}
