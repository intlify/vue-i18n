import { getText } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
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
      await page.goto(
        `http://localhost:8080/examples/${pattern}/missing/handler.html`
      )
    })

    test('warning', () => {
      console.log()
      // missing handler warning
      expect(warnings[0]).toEqual(`detect 'message.hello' key missing in 'ja'`)
      // fallback warning
      expect(warnings[1]).toEqual(
        `[intlify] Fall back to translate 'message.hello' key with 'en' locale.`
      )
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('hello world!')
    })
  })
})
