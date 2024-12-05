import { getText, url } from '../helper'
;['composition', 'petite'].forEach(pattern => {
  describe(`${pattern}`, () => {
    const warnings: string[] = []
    beforeAll(async () => {
      page.on('console', msg => {
        if (msg.type() === 'warning') {
          const text = msg.text()
          if (
            !text.match(/^\[intlify\] Legacy API mode has been/) &&
            !text.match(/^\[intlify\] 'v-t' has been deprecated in v11/)
          ) {
            warnings.push(msg.text())
          }
        }
      })
      await page.goto(url(`/examples/${pattern}/fallback/default-format.html`))
    })

    test('warning', () => {
      expect(warnings).toEqual([
        `[intlify] Not found 'messages.hello' key in 'ja' locale messages.`,
        `[intlify] Fall back to translate 'messages.hello' key with 'en' locale.`,
        `[intlify] Not found 'messages.hello' key in 'en' locale messages.`,
        `[intlify] Not found 'messages.hello' key in 'ja' locale messages.`,
        `[intlify] Fall back to translate 'messages.hello' key with 'en' locale.`,
        `[intlify] Not found 'messages.hello' key in 'en' locale messages.`,
        `[intlify] Not found 'good morning, {name}!' key in 'ja' locale messages.`,
        `[intlify] Fall back to translate 'good morning, {name}!' key with 'en' locale.`,
        `[intlify] Not found 'good morning, {name}!' key in 'en' locale messages.`
      ])
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p.p1')).toMatch('hello, kazupon!')
      expect(await getText(page, '#app p.p2')).toMatch('hi, kazupon!')
      expect(await getText(page, '#app p.p3')).toMatch('good morning, kazupon!')
    })
  })
})
