import { getText } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/plural/custom.html`
      )
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p.p1')).toMatch('1 машина')
      expect(await getText(page, '#app p.p2')).toMatch('2 машины')
      expect(await getText(page, '#app p.p3')).toMatch('4 машины')
      expect(await getText(page, '#app p.p4')).toMatch('12 машин')
      expect(await getText(page, '#app p.p5')).toMatch('21 машина')
      expect(await getText(page, '#app p.p6')).toMatch('нет бананов')
      expect(await getText(page, '#app p.p7')).toMatch('4 банана')
      expect(await getText(page, '#app p.p8')).toMatch('11 бананов')
      expect(await getText(page, '#app p.p9')).toMatch('31 банан')
    })
  })
})
