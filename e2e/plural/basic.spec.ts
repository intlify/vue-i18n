import { getText, url } from '../helper'
;['composition', 'petite'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(url(`/examples/${pattern}/plural/basic.html`))
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p.p1')).toMatch('car')
      expect(await getText(page, '#app p.p2')).toMatch('cars')
      expect(await getText(page, '#app p.p3')).toMatch('no apples')
      expect(await getText(page, '#app p.p4')).toMatch('one apple')
      expect(await getText(page, '#app p.p5')).toMatch('10 apples')
      expect(await getText(page, '#app p.p7')).toMatch('1 banana')
      expect(await getText(page, '#app p.p9')).toMatch('too many bananas')
    })
  })
})
