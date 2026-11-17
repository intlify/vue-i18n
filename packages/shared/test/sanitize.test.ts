import { JSDOM } from 'jsdom'
import { vi } from 'vitest'

// Mock the warn function before importing the sanitizer
vi.mock('../src/warn', () => ({
  warn: vi.fn()
}))

import { escapeHtml, sanitizeTranslatedHtml } from '../src/sanitize'
import { warn } from '../src/warn'

const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink'
const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml'

// The attribute names of every element, as a browser reads the HTML
function attributeNamesOf(html: string): string[] {
  return [...JSDOM.fragment(html).querySelectorAll('*')].flatMap(element =>
    element.getAttributeNames()
  )
}

describe('escapeHtml', () => {
  test('escape `<` and `>`', () => {
    expect(escapeHtml('<div>test</div>')).toBe('&lt;div&gt;test&lt;&#x2F;div&gt;')
  })

  test('escape quotes', () => {
    expect(escapeHtml(`"double" and 'single'`)).toBe('&quot;double&quot; and &apos;single&apos;')
  })

  test('escape `&` correctly', () => {
    expect(escapeHtml('&lt;')).toBe('&amp;lt;')
    expect(escapeHtml('&amp;')).toBe('&amp;amp;')
  })

  test('escape `/` for preventing closing tags', () => {
    expect(escapeHtml('</script>')).toBe('&lt;&#x2F;script&gt;')
    expect(escapeHtml('javascript://')).toBe('javascript:&#x2F;&#x2F;')
  })

  test('escape `=` for preventing attribute injection', () => {
    expect(escapeHtml('onerror=alert(1)')).toBe('onerror&#x3D;alert(1)')
    expect(escapeHtml('src=x onerror=alert(1)')).toBe('src&#x3D;x onerror&#x3D;alert(1)')
  })

  test('prevent img `onerror` attack', () => {
    expect(escapeHtml('<img src=x onerror=alert(1)>')).toBe(
      '&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;'
    )
  })

  test('prevent script injection', () => {
    expect(escapeHtml('</script><script>alert(1)</script>')).toBe(
      '&lt;&#x2F;script&gt;&lt;script&gt;alert(1)&lt;&#x2F;script&gt;'
    )
  })

  test('handle complex XSS payloads', () => {
    expect(escapeHtml('<img src="x" onerror="alert(\'XSS\')">')).toBe(
      '&lt;img src&#x3D;&quot;x&quot; onerror&#x3D;&quot;alert(&apos;XSS&apos;)&quot;&gt;'
    )
  })

  test('handle empty string', () => {
    expect(escapeHtml('')).toBe('')
  })

  test('handle normal text without special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })

  test('escape all special characters in order', () => {
    expect(escapeHtml('&<>"\'/=')).toBe('&amp;&lt;&gt;&quot;&apos;&#x2F;&#x3D;')
  })
})

describe('sanitizeTranslatedHtml', () => {
  test('neutralize event handlers', () => {
    const html = '<a href="#" onclick="alert(1)">Click</a>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<a href="#" &#111;nclick="alert(1)">Click</a>')
  })

  test('neutralize javascript URLs', () => {
    const html = '<a href="javascript:alert(1)">Click</a>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<a href="about:blank">Click</a>')
  })

  test('neutralize entity-encoded javascript URLs', () => {
    const html = '<a href="javascript&#58;alert(1)">Click</a>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<a href="about:blank">Click</a>')
  })

  test('neutralize entity-encoded javascript scheme characters', () => {
    const html = '<a href="&#x6A;avascript:alert(1)">Click</a>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<a href="about:blank">Click</a>')
  })

  test('neutralize control characters in javascript schemes', () => {
    const html = '<a href="java&#x09;script:alert(1)">Click</a>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<a href="about:blank">Click</a>')
  })

  test('keep javascript URLs inert after DOM parsing', () => {
    const html = '<a href="javascript:alert(1)">Click</a>'
    const result = sanitizeTranslatedHtml(html)
    const dom = new JSDOM(result)

    expect(dom.window.document.querySelector('a')?.getAttribute('href')).toBe('about:blank')
  })

  test('escape dangerous characters in attribute values', () => {
    const html = '<div title="<script>alert(1)</script>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div title="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>')
  })

  test('handle class attribute with normal values', () => {
    const html = '<div class="btn btn-primary">Button</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div class="btn btn-primary">Button</div>')
  })

  test('escape dangerous characters in class attribute', () => {
    // `onclick=` in the value stays a part of the value
    const html = '<div class="normal&quot; onclick=&quot;alert(1)">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(attributeNamesOf(result)).toEqual(['class'])
  })

  test('handle class attribute with script tags', () => {
    const html = '<div class="<script>alert(1)</script>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div class="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>')
  })

  test('handle multiple attributes including class', () => {
    const html =
      '<div id="test" class="btn&quot; onclick=&quot;alert(1)" data-value="<>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    // Check that dangerous characters in attribute values are escaped
    expect(result).toContain('class="btn&quot;')
    expect(result).toContain('data-value="&lt;&gt;"')
    // Check that onclick stays a part of the value
    expect(attributeNamesOf(result)).toEqual(['id', 'class', 'data-value'])
  })

  test('handle class attribute with single quotes', () => {
    const html = "<div class='btn btn-danger'>Alert</div>"
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe("<div class='btn btn-danger'>Alert</div>")
  })

  test('escape single quotes in class attribute with single quotes', () => {
    const html = "<div class='btn' onclick='alert(1)'>Test</div>"
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe("<div class='btn' &#111;nclick='alert(1)'>Test</div>")
  })

  test('handle id attribute with dangerous characters', () => {
    const html = '<div id="test&quot; onclick=&quot;alert(1)">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(attributeNamesOf(result)).toEqual(['id'])
  })

  test('handle id attribute with script injection', () => {
    const html = '<div id="<script>alert(1)</script>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div id="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>')
  })

  test('handle style attribute with dangerous characters', () => {
    const html = '<div style="color: red&quot; onclick=&quot;alert(1)">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(attributeNamesOf(result)).toEqual(['style'])
  })

  test('handle style attribute with javascript URL', () => {
    const html = '<div style="background: url(javascript:alert(1))">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div style="background: url(about:blank)">Test</div>')
  })

  test('handle style attribute with javascript URL with spaces', () => {
    const html = '<div style="background: url( javascript:alert(1) )">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div style="background: url(about:blank)">Test</div>')
  })

  test('handle style attribute with uppercase JavaScript URL', () => {
    const html = '<div style="background: url(JAVASCRIPT:alert(1))">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div style="background: url(about:blank)">Test</div>')
  })

  test('handle style attribute with entity-encoded javascript URL', () => {
    const html = '<div style="background: url(javascript&#58;alert(1))">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div style="background: url(about:blank)">Test</div>')
  })

  test('handle multiple dangerous attributes including id and style', () => {
    const html = '<div id="test&gt;" style="color: red" class="btn" onclick="alert(1)">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toContain('id="test&gt;"')
    expect(result).toContain('style="color: red"')
    expect(result).toContain('class="btn"')
    expect(result).toContain('&#111;nclick=')
  })

  test('handle formaction attribute with javascript URL', () => {
    const html = '<button formaction="javascript:alert(1)">Submit</button>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<button formaction="about:blank">Submit</button>')
  })

  test('handle data attributes with javascript URL', () => {
    const html = '<div data-href="javascript:alert(1)" data-value="safe">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    // data-* attributes are not sanitized as they don't execute directly
    expect(result).toBe('<div data-href="javascript:alert(1)" data-value="safe">Test</div>')
  })

  test('neutralize srcdoc attribute', () => {
    // the value of `srcdoc` is entity-decoded and parsed as a nested document,
    // so escaping the value is not enough: the attribute itself is neutralized
    const html = '<iframe srcdoc="<b>x</b>">Test</iframe>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<iframe &#115;rcdoc="&lt;b&gt;x&lt;/b&gt;">Test</iframe>')
    expect(JSDOM.fragment(result).querySelector('iframe')?.hasAttribute('srcdoc')).toBe(false)
  })

  test.each([
    ['uppercase', '<iframe SRCDOC="<b>x</b>"></iframe>'],
    ['mixed case', '<iframe SrcDoc="<b>x</b>"></iframe>'],
    ['spaces around `=`', '<iframe srcdoc = "<b>x</b>"></iframe>'],
    ['single quotes', "<iframe srcdoc='<b>x</b>'></iframe>"],
    ['unquoted value', '<iframe srcdoc=&lt;b&gt;x&lt;/b&gt;></iframe>'],
    ['no whitespace after a quoted attribute', '<iframe title="t"srcdoc="<b>x</b>"></iframe>'],
    ['slash boundary', '<iframe/srcdoc="<b>x</b>"></iframe>'],
    ['newline boundary', '<iframe\nsrcdoc="<b>x</b>"></iframe>']
  ])('neutralize srcdoc attribute: %s', (_, html) => {
    const result = sanitizeTranslatedHtml(html)
    expect(JSDOM.fragment(result).querySelector('iframe')?.hasAttribute('srcdoc')).toBe(false)
  })

  test('keep srcdoc in text and attribute values as is', () => {
    const result = sanitizeTranslatedHtml('<span title="srcdoc=x">use srcdoc=x</span>')
    const span = JSDOM.fragment(result).querySelector('span')
    expect(span?.getAttribute('title')).toBe('srcdoc=x')
    expect(span?.textContent).toBe('use srcdoc=x')
  })

  test('keep attributes whose name only contains srcdoc', () => {
    const html = '<div data-srcdoc="x">Test</div>'
    expect(sanitizeTranslatedHtml(html)).toBe(html)
  })

  test('neutralize javascript URLs in xlink:href', () => {
    // `xlink:href` is the older spelling of `href`, and an SVG `<a>` follows it when clicked
    const html = '<svg><a xlink:href="javascript:alert(1)"><text>x</text></a></svg>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<svg><a xlink:href="about:blank"><text>x</text></a></svg>')
    expect(JSDOM.fragment(result).querySelector('a')?.getAttributeNS(XLINK_NAMESPACE, 'href')).toBe(
      'about:blank'
    )
  })

  test.each([
    ['uppercase', '<svg><a XLINK:HREF="javascript:alert(1)"><text>x</text></a></svg>'],
    ['spaces around `=`', '<svg><a xlink:href = "javascript:alert(1)"><text>x</text></a></svg>'],
    ['single quotes', "<svg><a xlink:href='javascript:alert(1)'><text>x</text></a></svg>"],
    [
      'entity-encoded scheme',
      '<svg><a xlink:href="&#x6A;avascript:alert(1)"><text>x</text></a></svg>'
    ],
    ['unquoted value', '<svg><a xlink:href=javascript:alert(1)><text>x</text></a></svg>'],
    [
      'no whitespace after a quoted attribute',
      '<svg><a id="a"xlink:href=javascript:alert(1)><text>x</text></a></svg>'
    ],
    ['slash boundary', '<svg><a/xlink:href=javascript:alert(1)><text>x</text></a></svg>'],
    ['newline boundary', '<svg><a\nxlink:href=javascript:alert(1)><text>x</text></a></svg>']
  ])('neutralize javascript URLs in xlink:href: %s', (_, html) => {
    const result = sanitizeTranslatedHtml(html)
    const a = JSDOM.fragment(result).querySelector('a')
    expect(a?.getAttributeNS(XLINK_NAMESPACE, 'href')).toBe('about:blank')
  })

  test('keep other URLs in xlink:href as is', () => {
    const html =
      '<svg><a xlink:href="https://example.com/"><text>x</text></a><use xlink:href="#icon"/></svg>'
    expect(sanitizeTranslatedHtml(html)).toBe(html)
  })

  test('neutralize base elements', () => {
    // `<base>` changes how the page resolves every relative URL after it
    const html = '<base href="https://example.com/">Test'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('&lt;base href="https://example.com/">Test')
    expect(JSDOM.fragment(result).querySelector('base')).toBeNull()
  })

  test.each([
    ['uppercase', '<BASE href="https://example.com/">'],
    ['slash', '<base/href="https://example.com/">'],
    ['newline', '<base\nhref="https://example.com/">'],
    ['unquoted value', '<base href=https://example.com/>'],
    ['no attributes', '<base>']
  ])('neutralize base elements: %s', (_, html) => {
    expect(JSDOM.fragment(sanitizeTranslatedHtml(html)).querySelector('base')).toBeNull()
  })

  test('neutralize SVG animation elements', () => {
    // `<animate>` and `<set>` can set `href` of an SVG `<a>` through `values` or `to`,
    // which are not URL attributes
    const html =
      '<svg><a><set attributeName="href" to="javascript:alert(1)"/><text>x</text></a></svg>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<svg><a>&lt;set attributeName="href" to="javascript:alert(1)"/><text>x</text></a></svg>'
    )
    expect(JSDOM.fragment(result).querySelector('set')).toBeNull()
  })

  test.each([
    [
      'animate with values',
      '<svg><a><animate attributeName="href" values="javascript:alert(1)"/></a></svg>'
    ],
    [
      'animate with to',
      '<svg><a><animate attributeName="href" to="javascript:alert(1)"/></a></svg>'
    ],
    ['uppercase', '<svg><a><SET attributeName="href" to="javascript:alert(1)"/></a></svg>'],
    ['slash', '<svg><a><set/attributeName="href" to="javascript:alert(1)"/></a></svg>'],
    ['newline', '<svg><a><animate\nattributeName="href" values="javascript:alert(1)"/></a></svg>']
  ])('neutralize SVG animation elements: %s', (_, html) => {
    expect(JSDOM.fragment(sanitizeTranslatedHtml(html)).querySelector('animate, set')).toBeNull()
  })

  test('neutralize script elements', () => {
    // `<script>` does not run with `innerHTML`, but runs when the HTML is rendered on the server (SSR)
    const html = '<script>alert(1)</script>Test'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('&lt;script>alert(1)Test')
    expect(JSDOM.fragment(result).querySelector('script')).toBeNull()
  })

  test.each([
    ['uppercase', '<SCRIPT>alert(1)</SCRIPT>'],
    ['slash', '<script/src="https://example.com/x.js"></script>'],
    ['newline', '<script\nsrc="https://example.com/x.js"></script>'],
    ['data URL', '<script src="data:text/javascript,alert(1)"></script>'],
    ['SVG', '<svg><script>alert(1)</script></svg>'],
    ['no closing tag', '<script>']
  ])('neutralize script elements: %s', (_, html) => {
    expect(JSDOM.fragment(sanitizeTranslatedHtml(html)).querySelector('script')).toBeNull()
  })

  test('keep elements whose name only starts with base, animate, set or script', () => {
    const html =
      '<base-icon></base-icon><settings-panel></settings-panel><script-editor></script-editor>' +
      '<svg><animateTransform attributeName="transform" type="rotate" values="0;90"/></svg>'
    expect(sanitizeTranslatedHtml(html)).toBe(html)
  })

  test('handle attribute values without quotes', () => {
    const html = '<img src=x onerror=alert(1)>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<img src=x &#111;nerror=alert(1)>')
  })

  test('neutralize event handlers without whitespace separators', () => {
    const html = '<img src="x"onerror="alert(1)">'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<img src="x"&#111;nerror="alert(1)">')
  })

  test('neutralize unquoted javascript URLs after slash boundaries', () => {
    const html = '<a/href=javascript:alert(1)>Click</a>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<a/href=about:blank>Click</a>')
  })

  test('handle mixed quote styles', () => {
    const html = `<div title='test" onclick="alert(1)'>Test</div>`
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(`<div title='test&quot; onclick=&quot;alert(1)'>Test</div>`)
    expect(attributeNamesOf(result)).toEqual(['title'])
  })

  test('handle HTML entities in attribute values', () => {
    const html = '<div title="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    // Already escaped entities should remain as is
    expect(result).toBe('<div title="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>')
  })

  test('handle nested quotes in attributes', () => {
    const html = `<div title='"hello" onclick="alert(1)"'>Test</div>`
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(`<div title='&quot;hello&quot; onclick=&quot;alert(1)&quot;'>Test</div>`)
    expect(attributeNamesOf(result)).toEqual(['title'])
  })

  // Accessibility (a11y) attributes tests
  test('handle aria-label with dangerous characters', () => {
    const html = '<button aria-label="Click to <script>alert(1)</script>">Button</button>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<button aria-label="Click to &lt;script&gt;alert(1)&lt;/script&gt;">Button</button>'
    )
  })

  test('handle aria-describedby with quotes', () => {
    const html = `<input aria-describedby="desc&quot; onclick=&quot;alert(1)" />`
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(attributeNamesOf(result)).toEqual(['aria-describedby'])
  })

  test('handle role attribute with dangerous characters', () => {
    const html = '<div role="button&quot; onclick=&quot;alert(1)">Click</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(attributeNamesOf(result)).toEqual(['role'])
  })

  test('handle tabindex attribute', () => {
    const html = '<div tabindex="0&quot; onclick=&quot;alert(1)">Focusable</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(attributeNamesOf(result)).toEqual(['tabindex'])
  })

  test('handle alt attribute with dangerous content', () => {
    const html = '<img src="test.jpg" alt="Image of <script>alert(1)</script>" />'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<img src="test.jpg" alt="Image of &lt;script&gt;alert(1)&lt;/script&gt;" />'
    )
  })

  test('handle title attribute with dangerous content', () => {
    const html = '<abbr title="<img src=x onerror=alert(1)>">XSS</abbr>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<abbr title="&lt;img src=x onerror=alert(1)&gt;">XSS</abbr>')
    expect(attributeNamesOf(result)).toEqual(['title'])
  })

  test('handle multiple a11y attributes with dangerous content', () => {
    const html =
      '<button aria-label="<script>alert(1)</script>" role="button&quot; onclick=&quot;alert(1)" tabindex="0">Click</button>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toContain('aria-label="&lt;script&gt;alert(1)&lt;/script&gt;"')
    expect(result).toContain('role="button&quot;')
    expect(attributeNamesOf(result)).toEqual(['aria-label', 'role', 'tabindex'])
    expect(result).toContain('tabindex="0"')
  })

  test('handle aria-hidden attribute', () => {
    const html = '<div aria-hidden="true&quot; onclick=&quot;alert(1)">Hidden</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(attributeNamesOf(result)).toEqual(['aria-hidden'])
  })

  test('handle aria-live attribute', () => {
    const html = '<div aria-live="polite" aria-label="Status: <b>Active</b>">Status</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div aria-live="polite" aria-label="Status: &lt;b&gt;Active&lt;/b&gt;">Status</div>'
    )
  })
})

// The rest of the page that follows the translation when it is rendered on the server (SSR).
// It has quotes and `>`, which close what the translation leaves open
const PAGE_AFTER = `</div><p id="after" title="'a' > b">after</p>`
const pageParser = new new JSDOM().window.DOMParser()

function parseInPage(html: string): Document {
  return pageParser.parseFromString(
    `<!doctype html><body><div>${html}${PAGE_AFTER}</body>`,
    'text/html'
  )
}

function isPageAfterIntact(document: Document): boolean {
  const after = document.getElementById('after')
  return (
    after?.localName === 'p' &&
    after.attributes.length === 2 &&
    after.getAttribute('title') === "'a' > b" &&
    after.textContent === 'after'
  )
}

describe('sanitizeTranslatedHtml: unclosed tags', () => {
  test('turn a tag that is not closed at the end into text', () => {
    const result = sanitizeTranslatedHtml('<a title="x')
    expect(result).toBe('&lt;a title="x')
    expect(isPageAfterIntact(parseInPage(result))).toBe(true)
  })

  test('turn the tags in the rest of an unclosed tag into text as well', () => {
    expect(sanitizeTranslatedHtml('<a title="x<b>y')).toBe('&lt;a title="x&lt;b>y')
  })

  test.each([
    ['tag name', '<a'],
    ['before attribute name', '<a '],
    ['attribute name', '<a title'],
    ['after attribute name', '<a title '],
    ['before attribute value', '<a title='],
    ['double-quoted attribute value', '<a title="x'],
    ['single-quoted attribute value', "<a title='x"],
    ['unquoted attribute value', '<a title=x'],
    ['after attribute value', '<a title="x"'],
    ['self-closing start tag', '<a/'],
    ['end tag', '</a'],
    ['attribute of end tag', '</a title="x'],
    ['less-than sign', 'x<'],
    ['less-than sign and slash', 'x</']
  ])('turn a tag that is not closed at the end into text: %s', (_, html) => {
    const result = sanitizeTranslatedHtml(html)
    expect(result).not.toContain('<')
    expect(isPageAfterIntact(parseInPage(result))).toBe(true)
  })

  test('turn a comment that is not closed into text', () => {
    const result = sanitizeTranslatedHtml('<!-- x')
    expect(result).toBe('&lt;!-- x')
    expect(isPageAfterIntact(parseInPage(result))).toBe(true)
  })

  test('keep closed comments', () => {
    const html = '<b>x</b><!-- note --><!----><!-->x<!--->x<!--a--!>'
    expect(sanitizeTranslatedHtml(html)).toBe(html)
  })

  test.each([
    ['textarea', '<textarea>x'],
    ['title', '<title>x'],
    ['style', '<style>x'],
    ['xmp', '<xmp>x'],
    ['iframe', '<iframe>x'],
    ['noembed', '<noembed>x'],
    ['noframes', '<noframes>x'],
    ['noscript', '<noscript>x'],
    ['end tag that is not closed', '<textarea>x</textarea'],
    ['attribute of end tag that is not closed', '<textarea>x</textarea title="y'],
    ['end tag of another element', '<textarea>x</textareax>']
  ])('turn an element whose content is text into text when it is not closed: %s', (_, html) => {
    const result = sanitizeTranslatedHtml(html)
    expect(result.startsWith('&lt;')).toBe(true)
    expect(isPageAfterIntact(parseInPage(result))).toBe(true)
  })

  test('turn the content of an element whose content is text into text', () => {
    const result = sanitizeTranslatedHtml('<textarea><b>x</b></textarea>')
    expect(result).toBe('<textarea>&lt;b>x&lt;/b></textarea>')
    expect(JSDOM.fragment(result).querySelector('textarea')?.value).toBe('<b>x</b>')
  })

  test('turn the content of an SVG element with the same name into text as well', () => {
    // the content of `<style>` is markup in SVG, but text in HTML
    const result = sanitizeTranslatedHtml('<svg><style><a>x</a></style></svg>')
    expect(result).toBe('<svg><style>&lt;a>x&lt;/a></style></svg>')
    expect(JSDOM.fragment(result).querySelector('a')).toBeNull()
  })

  test('neutralize plaintext elements', () => {
    // `<plaintext>` turns the rest of the page into text
    const result = sanitizeTranslatedHtml('<plaintext>x')
    expect(result).toBe('&lt;plaintext>x')
    expect(isPageAfterIntact(parseInPage(result))).toBe(true)
  })
})

describe('sanitizeTranslatedHtml: read tags as the HTML tokenizer does', () => {
  test('read an unquoted value with quotes and `=` as one value', () => {
    // quotes and `=` belong to an unquoted value
    const result = sanitizeTranslatedHtml(`<a title=a"b='c class="d">x</a>`)
    expect(result).toBe('<a title=a&quot;b=&apos;c class="d">x</a>')
    const a = JSDOM.fragment(result).querySelector('a')
    expect(a?.getAttribute('title')).toBe(`a"b='c`)
    expect(a?.getAttribute('class')).toBe('d')
  })

  test('escape unquoted values, and keep them unquoted', () => {
    const result = sanitizeTranslatedHtml('<a href=/x?a=1&b=2 class=y>x</a>')
    expect(result).toBe('<a href=/x?a=1&amp;b=2 class=y>x</a>')
    expect(JSDOM.fragment(result).querySelector('a')?.getAttribute('href')).toBe('/x?a=1&b=2')
  })

  test('turn `<` that does not start a tag or a comment into text', () => {
    expect(sanitizeTranslatedHtml('1 < 2')).toBe('1 &lt; 2')
    expect(sanitizeTranslatedHtml('<!DOCTYPE html>x')).toBe('&lt;!DOCTYPE html>x')
    expect(sanitizeTranslatedHtml('<?x?>')).toBe('&lt;?x?>')
    expect(sanitizeTranslatedHtml('<svg><![CDATA[x]]></svg>')).toBe('<svg>&lt;![CDATA[x]]></svg>')
    expect(sanitizeTranslatedHtml('</>')).toBe('&lt;/>')
  })

  test('read `<` in an attribute name as a part of the name', () => {
    // `<` there does not start another tag
    const html = '<a b<c>x</a>'
    expect(sanitizeTranslatedHtml(html)).toBe(html)
    expect(attributeNamesOf(html)).toEqual(['b<c'])
  })

  test('read the attributes of end tags to find their end', () => {
    // browsers ignore the attributes of end tags, but `>` in a quoted value does not end the tag
    const html = '<b>x</b title=">">y'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(html)
    expect(JSDOM.fragment(result).textContent).toBe('xy')
  })
})

// The DOM that browsers make from a translation rendered with `v-html` (`innerHTML`)
const renderBox = new JSDOM().window.document.createElement('div')

function render(html: string): string {
  renderBox.innerHTML = html
  return renderBox.innerHTML
}

describe('sanitizeTranslatedHtml: elements left open', () => {
  test.each([
    ['line break', 'Hello<br>World'],
    ['formatting elements', '<strong>Hello</strong>, <em>World</em>'],
    ['link', '<a href="/docs">Docs</a>'],
    ['list', '<ul><li>a</li><li>b</li></ul>'],
    ['table', '<table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>'],
    ['select', '<select><option>a</option><option>b</option></select>'],
    ['template', '<template><div>a</div></template>'],
    ['SVG icon', '<svg viewBox="0 0 10 10"><path d="M0 0L10 10"/></svg> icon'],
    ['MathML', '<math><mi>x</mi><mo>=</mo><mn>1</mn></math>'],
    ['SVG foreignObject', '<svg><foreignObject><div>x</div></foreignObject></svg>'],
    ['form', '<form action="/search"><input name="q"><button>Search</button></form>'],
    ['void elements', '<img src="/a.png" alt="a"><hr><input type="checkbox">'],
    ['comment', '<b>x</b><!-- note -->']
  ])('keep well-formed HTML as it is: %s', (_, html) => {
    expect(sanitizeTranslatedHtml(html)).toBe(html)
  })

  test.each([
    ['formatting element', '<b>bold', '<b>bold</b>'],
    ['paragraphs', '<p>a<p>b', '<p>a</p><p>b</p>'],
    ['paragraph before a list', '<p>Intro<ul><li>a</li></ul>', '<p>Intro</p><ul><li>a</li></ul>'],
    ['list items', '<ul><li>a<li>b</ul>after', '<ul><li>a<li>b</li></li></ul>after'],
    [
      'table cells',
      '<table><tr><td>a<td>b</table>after',
      '<table><tr><td>a<td>b</td></td></tr></table>after'
    ],
    ['element in an element', '<div><span>x</div>y', '<div><span>x</span></div>y'],
    [
      'SVG',
      '<svg viewBox="0 0 1 1"><path d="M0 0"/>',
      '<svg viewBox="0 0 1 1"><path d="M0 0"/></svg>'
    ],
    ['tag that leaves SVG', '<svg><g><p>x', '<svg><g></g></svg><p>x</p>']
  ])('close the elements that are left open: %s', (_, html, expected) => {
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(expected)
    // browsers close them in the same way when the translation is rendered on the client
    expect(render(result)).toBe(render(html))
    expect(sanitizeTranslatedHtml(result)).toBe(result)
  })

  test('close the elements in an element before its end tag', () => {
    // browsers would make `<b>` again for `y`, which the translation does not ask for
    expect(sanitizeTranslatedHtml('<p><b>x</p>y')).toBe('<p><b>x</b></p>y')
  })

  test('remove end tags that close no element of the translation', () => {
    // they would close the element that the translation is rendered in, or an element after it
    expect(sanitizeTranslatedHtml('a</div>b</span>c')).toBe('abc')
  })

  test('keep `</br>` and `</p>`, which browsers read as `<br>` and `<p></p>`', () => {
    expect(sanitizeTranslatedHtml('Hello</br>World')).toBe('Hello</br>World')
    expect(sanitizeTranslatedHtml('Hello</p>World')).toBe('Hello</p>World')
  })

  test('turn a form that the translation does not close into text', () => {
    // in a form of the page, browsers ignore `<form>`, and `</form>` would close the form of the page
    expect(sanitizeTranslatedHtml('<form action="/x"><input name="q">')).toBe(
      '&lt;form action="/x"><input name="q">'
    )
  })

  test.each([
    ['foreignObject', '<foreignObject>x'],
    ['desc', '<desc>x'],
    ['mi', '<mi>x'],
    ['annotation-xml', '<annotation-xml encoding="text/html">x']
  ])('turn SVG and MathML integration points outside SVG and MathML into text: %s', (_, html) => {
    expect(sanitizeTranslatedHtml(html)).toBe(`&lt;${html.slice(1)}`)
  })

  test('warn in development when elements are not closed', () => {
    vi.mocked(warn).mockClear()
    sanitizeTranslatedHtml('<b>bold')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('Unclosed or misnested elements'))

    vi.mocked(warn).mockClear()
    sanitizeTranslatedHtml('<b>bold</b><br>')
    expect(warn).not.toHaveBeenCalled()
  })
})

describe('sanitizeTranslatedHtml: compare with the HTML parser', () => {
  // Pieces that change where the HTML tokenizer starts and ends tags, attributes and comments
  const PIECES = [
    '<a',
    '<a>',
    '</a>',
    '<b>',
    '<iframe',
    '<form',
    '<svg>',
    '<svg><a',
    '</svg>',
    '<math>',
    '<textarea>',
    '</textarea>',
    '<title>',
    '</title>',
    '<style>',
    '</style>',
    '<xmp>',
    '<noscript>',
    '<script>',
    '<plaintext>',
    '<base',
    '<set',
    '<',
    '</',
    '<!--',
    '-->',
    '--!>',
    '<!',
    '<?',
    '<![CDATA[',
    ']]>',
    ' ',
    '\n',
    '\t',
    '\r',
    '/',
    '>',
    '=',
    '"',
    "'",
    '`',
    'x',
    ' href=',
    ' src=',
    ' action=',
    ' formaction=',
    ' xlink:href=',
    ' onclick=',
    ' ONCLICK=',
    ' srcdoc=',
    ' style=',
    ' title=',
    'javascript:0',
    'JavaScript:0',
    'java&#x09;script:0',
    '&#x6A;avascript:0',
    'javascript&colon;0',
    '&quot;',
    '&lt;',
    '&amp;'
  ]
  // Pieces for the attributes of a start tag
  const TAG_STARTS = ['<a', '<iframe', '<form', '<svg><a']
  const ATTRIBUTE_PIECES = [
    ' ',
    '\n',
    '/',
    '=',
    '"',
    "'",
    '`',
    'x',
    ' title=',
    ' href=',
    ' src=',
    ' action=',
    ' xlink:href=',
    ' onclick=',
    ' srcdoc=',
    'javascript:0',
    '&quot;',
    '<',
    '>'
  ]
  const URL_ATTRIBUTE_NAMES = new Set(['href', 'src', 'action', 'formaction'])
  const DANGEROUS_ELEMENT_NAMES = new Set(['base', 'animate', 'set', 'script', 'plaintext'])

  // mulberry32, so that the same inputs are made on every run
  function createRandom(seed: number): () => number {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // as the URL parser reads the scheme: leading and trailing C0 controls and spaces,
  // and tabs and newlines anywhere, are removed
  // oxlint-disable-next-line eslint/no-control-regex -- the URL parser removes C0 controls
  const C0_CONTROLS_AND_SPACES_AROUND = /^[\u0000-\u0020]+|[\u0000-\u0020]+$/g
  function isJavascriptUrl(url: string): boolean {
    return /^javascript:/i.test(
      url.replace(C0_CONTROLS_AND_SPACES_AROUND, '').replace(/[\t\n\r]/g, '')
    )
  }

  function findActiveContent(root: Document | DocumentFragment): string | undefined {
    for (const element of root.querySelectorAll('*')) {
      if (DANGEROUS_ELEMENT_NAMES.has(element.localName.toLowerCase())) {
        return `<${element.localName}>`
      }
      for (const { name, localName, value } of element.attributes) {
        if (/^on[a-z]/i.test(name) || localName === 'srcdoc') {
          return `${name} of <${element.localName}>`
        }
        if (URL_ATTRIBUTE_NAMES.has(localName) && isJavascriptUrl(value)) {
          return `javascript: URL in ${name} of <${element.localName}>`
        }
      }
    }
  }

  function check(html: string): string | undefined {
    const result = sanitizeTranslatedHtml(html)
    const page = parseInPage(result)
    return (
      findActiveContent(JSDOM.fragment(result)) ||
      findActiveContent(page) ||
      (!isPageAfterIntact(page) && 'the rest of the page is changed') ||
      (sanitizeTranslatedHtml(result) !== result && 'the result changes when sanitized again') ||
      undefined
    )
  }

  function pick(random: () => number, pieces: string[], maxLength: number): string {
    return Array.from(
      { length: 1 + Math.floor(random() * maxLength) },
      () => pieces[Math.floor(random() * pieces.length)]
    ).join('')
  }

  function findFailures(makeHtml: () => string): string[] {
    const failures: string[] = []
    for (let count = 0; count < 2000; count++) {
      const html = makeHtml()
      const problem = check(html)
      if (problem) {
        failures.push(`${problem}: ${JSON.stringify(html)}`)
      }
    }
    return failures
  }

  // Reading 2,000 inputs with jsdom takes several seconds on CI, where the tests run with coverage
  const timeout = 60_000

  test('leave nothing active, and keep the rest of the page', { timeout }, () => {
    const random = createRandom(1)
    expect(findFailures(() => pick(random, PIECES, 16))).toEqual([])
  })

  test('check every attribute of a start tag', { timeout }, () => {
    const random = createRandom(2)
    expect(
      findFailures(() => `${pick(random, TAG_STARTS, 1)}${pick(random, ATTRIBUTE_PIECES, 12)}>x`)
    ).toEqual([])
  })

  // Pieces that change how the tree builder opens and closes elements, including SVG and MathML
  const ELEMENT_PIECES = [
    '<svg>',
    '</svg>',
    '<svg/>',
    '<math>',
    '</math>',
    '<mi>',
    '</mi>',
    '<mtext>',
    '<mglyph>',
    '<annotation-xml>',
    '<annotation-xml encoding="text/html">',
    '</annotation-xml>',
    '<desc>',
    '</desc>',
    '<foreignObject>',
    '</foreignObject>',
    '<title>t</title>',
    '<g>',
    '</g>',
    '<circle/>',
    '<circle>',
    '</circle>',
    '<font color="red">',
    '<font>',
    '</font>',
    '<object>',
    '</object>',
    '<applet>',
    '<marquee>',
    '</marquee>',
    '<table>',
    '</table>',
    '<tr>',
    '<td>',
    '</td>',
    '<caption>',
    '<template>',
    '</template>',
    '<select>',
    '</select>',
    '<option>',
    '</option>',
    '<form>',
    '</form>',
    '<a href="/y">',
    '</a>',
    '<b>',
    '</b>',
    '<i>',
    '</i>',
    '<nobr>',
    '<p>',
    '</p>',
    '<br>',
    '</br>',
    '<div>',
    '</div>',
    '<span>',
    '</span>',
    '<ul>',
    '<li>',
    '</li>',
    '</ul>',
    '<h1>',
    '</h1>',
    '<button>',
    '</button>',
    '<img src="x">',
    '<input>',
    '<body>',
    '</body>',
    '</html>',
    '<head>',
    '<style>s</style>',
    '<textarea>t</textarea>',
    'x',
    ' ',
    '&amp;'
  ]
  // Elements that a translation is rendered in: [name, start tags, end tags]
  const CONTAINERS: [string, string, string][] = [
    ['div', '<div>', '</div>'],
    ['span', '<span>', '</span>'],
    ['p', '<p>', '</p>'],
    ['a', '<a href="/c">', '</a>'],
    ['button', '<button>', '</button>'],
    ['li', '<ul><li>', '</li></ul>'],
    ['td', '<table><tbody><tr><td>', '</td></tr></tbody></table>'],
    ['div in a form', '<form id="outer-form"><div>', '</div><input id="outer-input"></form>'],
    ['span in an SVG foreignObject', '<svg><foreignObject id="fo"><span>', '</span>'],
    ['button in an SVG foreignObject', '<svg><foreignObject id="fo"><button>', '</button>']
  ]
  // A start tag of a translation can close these containers (`<button>` closes `<button>`, and
  // `<li>` closes `<li>`), and the end tags of the translation then close elements outside them.
  // Browsers do the same with the closed translation, so only the script after them is checked
  const CONTAINERS_CLOSED_BY_START_TAGS = new Set([
    'button',
    'li',
    'button in an SVG foreignObject'
  ])
  // The rest of the page: an inline script, and elements with a link, a form and text
  const REST_OF_PAGE =
    '<script id="after-script">window.state = "&quot;"</script>' +
    '<nav id="after"><a id="after-link" href="/x">link</a>' +
    '<form id="after-form"><input id="after-input"></form><span id="after-text">text</span></nav>'

  function checkInContainer(
    result: string,
    [name, start, end]: [string, string, string]
  ): string | undefined {
    const close = start.includes('<foreignObject') ? '</foreignObject></svg>' : ''
    const page = pageParser.parseFromString(
      `<!doctype html><body><main id="main">${start}${result}${end}${REST_OF_PAGE}${close}</main></body>`,
      'text/html'
    )
    const script = page.getElementById('after-script')
    if (script?.namespaceURI !== HTML_NAMESPACE) {
      // an SVG script is parsed as markup, and character references in it are decoded before it runs
      return `the script after the translation is not an HTML script in ${name}`
    }
    if (CONTAINERS_CLOSED_BY_START_TAGS.has(name)) {
      return
    }
    const parent = page.getElementById('fo') || page.getElementById('main')
    const after = page.getElementById('after')
    const text = page.getElementById('after-text')
    if (
      script.parentNode !== parent ||
      after?.parentNode !== parent ||
      page.getElementById('after-link')?.parentNode !== after ||
      text?.parentNode !== after ||
      text.childNodes.length !== 1 ||
      text.firstChild?.nodeType !== page.TEXT_NODE
    ) {
      return `the rest of the page is changed in ${name}`
    }
    // a `<form>` left open makes browsers ignore the `<form>` after it, and its inputs go to the open one
    const form = page.getElementById('after-form')
    const input = page.getElementById('after-input') as HTMLInputElement | null
    if (!form || input?.form !== form) {
      return `the form after the translation is taken over in ${name}`
    }
    const outerInput = page.getElementById('outer-input') as HTMLInputElement | null
    // a `<form>` that the translation closes by itself still closes the form of the page,
    // because browsers ignore the `<form>` in the form of the page
    if (
      outerInput &&
      outerInput.form !== page.getElementById('outer-form') &&
      !/<form[\t\n\f\r />]/i.test(result)
    ) {
      return `the form around the translation is closed in ${name}`
    }
  }

  test(
    'keep the rest of the page out of the elements that a translation leaves open',
    { timeout },
    () => {
      const random = createRandom(3)
      const failures: string[] = []
      for (let count = 0; count < 300; count++) {
        const html = pick(random, ELEMENT_PIECES, 10)
        const result = sanitizeTranslatedHtml(html)
        for (const container of CONTAINERS) {
          const problem = checkInContainer(result, container)
          if (problem) {
            failures.push(`${problem}: ${JSON.stringify(html)}`)
          }
        }
        if (sanitizeTranslatedHtml(result) !== result) {
          failures.push(`the result changes when sanitized again: ${JSON.stringify(html)}`)
        }
      }
      expect(failures).toEqual([])
    }
  )

  // Translations that leave elements open, or that close elements outside them: the reported shapes, and
  // the shapes found while fixing them. On the server (SSR), the rest of the page followed them in the
  // same HTML, and was read as a part of what they left open: `<template>` and `<select>` took it in,
  // `<form>` took in its inputs, and with `<svg>` kept open, the inline script after the translation
  // became an SVG script, whose character references are decoded before it runs
  const IN_DIV: [string, string, string] = ['div', '<div>', '</div>']
  const IN_SPAN: [string, string, string] = ['span', '<span>', '</span>']
  const IN_FOOTER: [string, string, string] = [
    'small in a footer',
    '<footer><small>',
    '</small></footer>'
  ]
  const OPEN_ELEMENT_INPUTS: [string, string, string, string][] = [
    ['<template><div>hidden</div>', ...IN_DIV],
    ['<select><option>x</option>', ...IN_DIV],
    ['<form action="/x">', ...IN_DIV],
    ['<object><svg>', ...IN_DIV],
    ['<table><svg>', ...IN_DIV],
    ['<math><mi><svg>', ...IN_DIV],
    ['<object><svg><desc><div></object></div></desc>', ...IN_DIV],
    ['© Example<object><svg>', ...IN_FOOTER],
    ['<div><svg>', ...IN_SPAN],
    ['<li><svg>', ...IN_SPAN],
    ['<form><b><img src="x"><svg>', ...IN_SPAN],
    ['<select><div><svg>', ...IN_SPAN],
    ['</a><svg>', 'a', '<a href="/c">', '</a>'],
    [
      '</span></foreignObject>',
      'span in an SVG foreignObject',
      '<svg><foreignObject id="fo"><span>',
      '</span>'
    ],
    [
      '<foreignObject><button>',
      'button in an SVG foreignObject',
      '<svg><foreignObject id="fo"><button>',
      '</button>'
    ]
  ]

  test.each(OPEN_ELEMENT_INPUTS)(
    'keep the rest of the page out of what a translation leaves open: %s in %s',
    (html, name, start, end) => {
      expect(checkInContainer(sanitizeTranslatedHtml(html), [name, start, end])).toBeUndefined()
    }
  )

  // Inputs that the sanitizer used to read differently from browsers, as they are
  // - an attribute value that is not closed at the end of a translation
  const UNCLOSED_VALUE_INPUTS: string[] = ['<iframe src="javascript:alert(document.domain)//']
  // - an unquoted attribute value with quotes, followed by more attributes
  const UNQUOTED_VALUE_INPUTS: string[] = [
    '<iframe x=y"z="q src="javascript:alert(document.domain)"></iframe>',
    '<a x=y"z="q href="javascript:alert(document.domain)">click</a>'
  ]

  test.each([
    ['an attribute value that is not closed', UNCLOSED_VALUE_INPUTS],
    ['an unquoted attribute value with quotes', UNQUOTED_VALUE_INPUTS]
  ])('leave nothing active, and keep the rest of the page: %s', (_, inputs) => {
    expect(inputs.length).toBeGreaterThan(0)
    const failures = inputs.flatMap(html => {
      const problem = check(html)
      return problem ? [`${problem}: ${JSON.stringify(html)}`] : []
    })
    expect(failures).toEqual([])
  })
})
