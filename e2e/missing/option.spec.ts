import { getText, url } from '../helper'
;['composition', 'petite'].forEach(pattern => {
  describe(`${pattern}`, () => {
    const warnings: string[] = []
    beforeAll(async () => {
      page.on('console', msg => {
        if (msg.type() === 'warning') {
          const text = msg.text()
          if (!text.match(/^\[intlify\] Legacy API mode has been/)) {
            warnings.push(msg.text())
          }
        }
      })
      await page.goto(url(`/examples/${pattern}/missing/option.html`))
    })

    test('warning', () => {
      // fallback warning only
      expect(warnings[0]).toEqual(
        `[intlify] Fall back to translate 'message.hello' key with 'en' locale.`
      )
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('hello, kazupon!')
    })
  })
})
