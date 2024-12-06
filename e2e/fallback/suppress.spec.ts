import { getText, url } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
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
      await page.goto(url(`/examples/${pattern}/fallback/suppress.html`))
    })

    test('warning', () => {
      // missing warning only!
      expect(warnings[0]).toEqual(
        `[intlify] Not found 'message.hello' key in 'ja' locale messages.`
      )
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('hello world!')
    })
  })
})
