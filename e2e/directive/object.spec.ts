import { getText, url } from '../helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(url(`/examples/${pattern}/directive/object.html`))
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p.p1')).toMatch('こんにちは、 kazupon！')
      expect(await getText(page, '#app p.p2')).toMatch('good bye!')
    })
  })
})
