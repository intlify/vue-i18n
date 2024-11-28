import { getText, url } from '../helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(url(`/examples/${pattern}/directive/plural.html`))
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('2 bananas')
    })
  })
})
