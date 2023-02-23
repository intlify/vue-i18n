import { getText } from '../helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/directive/plural.html`
      )
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('2 bananas')
    })
  })
})
