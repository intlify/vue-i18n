import { vi } from 'vitest'

// Mock the warn function before importing anything else
vi.mock('../src/warn', () => ({
  warn: vi.fn()
}))

import {
  escapeHtml,
  format,
  generateCodeFrame,
  join,
  makeSymbol,
  sanitizeTranslatedHtml
} from '../src/index'

test('format', () => {
  expect(format(`foo: {0}`, 'x')).toEqual('foo: x')
  expect(format(`foo: {0}, {1}`, 'x', 'y')).toEqual('foo: x, y')
  expect(format(`foo: {x}, {y}`, { x: 1, y: 2 })).toEqual('foo: 1, 2')
})

test('generateCodeFrame', () => {
  const source = `hi, { 'kazupon' }`.trim()
  const keyStart = source.indexOf(`{ 'kazupon' }`)
  const keyEnd = keyStart + `{ 'kazupon' }`.length
  expect(generateCodeFrame(source, keyStart, keyEnd)).toMatchSnapshot()
})

test('makeSymbol', () => {
  expect(makeSymbol('foo')).not.toEqual(makeSymbol('foo'))
  expect(makeSymbol('bar', true)).toEqual(makeSymbol('bar', true))
})

test('join', () => {
  expect(join([])).toEqual([].join(''))
  expect(join(['a'], ',')).toEqual(['a'].join(','))
  expect(join(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'].join(''))
  expect(join(['a', 'b', 'c'], ' ')).toEqual(['a', 'b', 'c'].join(' '))

  const longSize = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  expect(join(longSize, ' ')).toEqual(longSize.join(' '))
})

describe('escapeHtml', () => {
  test('escape `<` and `>`', () => {
    expect(escapeHtml('<div>test</div>')).toBe(
      '&lt;div&gt;test&lt;&#x2F;div&gt;'
    )
  })

  test('escape quotes', () => {
    expect(escapeHtml(`"double" and 'single'`)).toBe(
      '&quot;double&quot; and &apos;single&apos;'
    )
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
    expect(escapeHtml('src=x onerror=alert(1)')).toBe(
      'src&#x3D;x onerror&#x3D;alert(1)'
    )
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
    expect(result).toBe('<a href="javascript&#58;alert(1)">Click</a>')
  })

  test('escape dangerous characters in attribute values', () => {
    const html = '<div title="<script>alert(1)</script>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div title="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>'
    )
  })

  test('handle class attribute with normal values', () => {
    const html = '<div class="btn btn-primary">Button</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<div class="btn btn-primary">Button</div>')
  })

  test('escape dangerous characters in class attribute', () => {
    const html = '<div class="normal&quot; onclick=&quot;alert(1)">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div class="normal&quot; &#111;nclick=&quot;alert(1)">Test</div>'
    )
  })

  test('handle class attribute with script tags', () => {
    const html = '<div class="<script>alert(1)</script>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div class="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>'
    )
  })

  test('handle multiple attributes including class', () => {
    const html =
      '<div id="test" class="btn&quot; onclick=&quot;alert(1)" data-value="<>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    // Check that dangerous characters in attribute values are escaped
    expect(result).toContain('class="btn&quot;')
    expect(result).toContain('data-value="&lt;&gt;"')
    // Check that onclick is neutralized
    expect(result).toContain('&#111;nclick=')
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
    expect(result).toBe(
      '<div id="test&quot; &#111;nclick=&quot;alert(1)">Test</div>'
    )
  })

  test('handle id attribute with script injection', () => {
    const html = '<div id="<script>alert(1)</script>">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div id="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>'
    )
  })

  test('handle style attribute with dangerous characters', () => {
    const html =
      '<div style="color: red&quot; onclick=&quot;alert(1)">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div style="color: red&quot; &#111;nclick=&quot;alert(1)">Test</div>'
    )
  })

  test('handle style attribute with javascript URL', () => {
    const html = '<div style="background: url(javascript:alert(1))">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div style="background: url(javascript&#58;alert(1))">Test</div>'
    )
  })

  test('handle style attribute with javascript URL with spaces', () => {
    const html =
      '<div style="background: url( javascript:alert(1) )">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div style="background: url( javascript&#58;alert(1) )">Test</div>'
    )
  })

  test('handle style attribute with uppercase JavaScript URL', () => {
    const html = '<div style="background: url(JAVASCRIPT:alert(1))">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div style="background: url(javascript&#58;alert(1))">Test</div>'
    )
  })

  test('handle multiple dangerous attributes including id and style', () => {
    const html =
      '<div id="test&gt;" style="color: red" class="btn" onclick="alert(1)">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toContain('id="test&gt;"')
    expect(result).toContain('style="color: red"')
    expect(result).toContain('class="btn"')
    expect(result).toContain('&#111;nclick=')
  })

  test('handle formaction attribute with javascript URL', () => {
    const html = '<button formaction="javascript:alert(1)">Submit</button>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<button formaction="javascript&#58;alert(1)">Submit</button>'
    )
  })

  test('handle data attributes with javascript URL', () => {
    const html =
      '<div data-href="javascript:alert(1)" data-value="safe">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    // data-* attributes are not sanitized as they don't execute directly
    expect(result).toBe(
      '<div data-href="javascript:alert(1)" data-value="safe">Test</div>'
    )
  })

  test('handle srcdoc attribute', () => {
    const html = '<iframe srcdoc="<script>alert(1)</script>">Test</iframe>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<iframe srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;">Test</iframe>'
    )
  })

  test('handle attribute values without quotes', () => {
    const html = '<img src=x onerror=alert(1)>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe('<img src=x &#111;nerror=alert(1)>')
  })

  test('handle mixed quote styles', () => {
    const html = `<div title='test" onclick="alert(1)'>Test</div>`
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      `<div title='test&quot; &#111;nclick=&quot;alert(1)'>Test</div>`
    )
  })

  test('handle HTML entities in attribute values', () => {
    const html = '<div title="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>'
    const result = sanitizeTranslatedHtml(html)
    // Already escaped entities should remain as is
    expect(result).toBe(
      '<div title="&lt;script&gt;alert(1)&lt;/script&gt;">Test</div>'
    )
  })

  test('handle nested quotes in attributes', () => {
    const html = `<div title='"hello" onclick="alert(1)"'>Test</div>`
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      `<div title='&quot;hello&quot; &#111;nclick=&quot;alert(1)&quot;'>Test</div>`
    )
  })

  // Accessibility (a11y) attributes tests
  test('handle aria-label with dangerous characters', () => {
    const html =
      '<button aria-label="Click to <script>alert(1)</script>">Button</button>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<button aria-label="Click to &lt;script&gt;alert(1)&lt;/script&gt;">Button</button>'
    )
  })

  test('handle aria-describedby with quotes', () => {
    const html = `<input aria-describedby="desc&quot; onclick=&quot;alert(1)" />`
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<input aria-describedby="desc&quot; &#111;nclick=&quot;alert(1)" />'
    )
  })

  test('handle role attribute with dangerous characters', () => {
    const html = '<div role="button&quot; onclick=&quot;alert(1)">Click</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div role="button&quot; &#111;nclick=&quot;alert(1)">Click</div>'
    )
  })

  test('handle tabindex attribute', () => {
    const html =
      '<div tabindex="0&quot; onclick=&quot;alert(1)">Focusable</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div tabindex="0&quot; &#111;nclick=&quot;alert(1)">Focusable</div>'
    )
  })

  test('handle alt attribute with dangerous content', () => {
    const html =
      '<img src="test.jpg" alt="Image of <script>alert(1)</script>" />'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<img src="test.jpg" alt="Image of &lt;script&gt;alert(1)&lt;/script&gt;" />'
    )
  })

  test('handle title attribute with dangerous content', () => {
    const html = '<abbr title="<img src=x onerror=alert(1)>">XSS</abbr>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<abbr title="&lt;img src=x &#111;nerror=alert(1)&gt;">XSS</abbr>'
    )
  })

  test('handle multiple a11y attributes with dangerous content', () => {
    const html =
      '<button aria-label="<script>alert(1)</script>" role="button&quot; onclick=&quot;alert(1)" tabindex="0">Click</button>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toContain(
      'aria-label="&lt;script&gt;alert(1)&lt;/script&gt;"'
    )
    expect(result).toContain('role="button&quot;')
    expect(result).toContain('&#111;nclick=')
    expect(result).toContain('tabindex="0"')
  })

  test('handle aria-hidden attribute', () => {
    const html =
      '<div aria-hidden="true&quot; onclick=&quot;alert(1)">Hidden</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div aria-hidden="true&quot; &#111;nclick=&quot;alert(1)">Hidden</div>'
    )
  })

  test('handle aria-live attribute', () => {
    const html =
      '<div aria-live="polite" aria-label="Status: <b>Active</b>">Status</div>'
    const result = sanitizeTranslatedHtml(html)
    expect(result).toBe(
      '<div aria-live="polite" aria-label="Status: &lt;b&gt;Active&lt;/b&gt;">Status</div>'
    )
  })
})
