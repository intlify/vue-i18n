import { JSDOM } from 'jsdom'
import { vi } from 'vitest'

// Mock the warn function before importing the sanitizer
vi.mock('../src/warn', () => ({
  warn: vi.fn()
}))

import { escapeHtml, sanitizeTranslatedHtml } from '../src/sanitize'

const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink'

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
    expect(result).toBe('&lt;script>alert(1)</script>Test')
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
