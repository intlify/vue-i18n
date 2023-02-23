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
        `http://localhost:8080/examples/${pattern}/fallback/format.html`
      )
    })

    test('warning', () => {
      // missing warning only
      expect(warnings[0]).toEqual(
        `[intlify] Not found 'hello, {name}!' key in 'ja' locale messages.`
      )
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('hello, kazupon!')
    })
  })
})
