import { getText } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    const warnings: string[] = []
    beforeAll(async () => {
      page.on('console', msg => {
        if (msg.type() === 'warning') {
          warnings.push(msg.text())
        }
      })
      await page.goto(
        `http://localhost:8080/examples/${pattern}/missing/suppress.html`
      )
    })

    test('warning', () => {
      // fallback warning only
      expect(warnings[0]).toEqual(
        `[intlify] Fall back to translate 'message.hello' key with 'en' locale.`
      )
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('hello world!')
    })
  })
})
