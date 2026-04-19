import { getText, url } from '../helper'
;['composition'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(url(`/examples/${pattern}/components/datetime-format.html`))
    })

    test('rendering', async () => {
      console.log(new Date())
      expect(await getText(page, '#app p.p1')).toMatch(
        /([1-9]|1[0-2])\/([1-9]|[12]\d|3[01])\/([12]\d{3})/
      )
      expect(await getText(page, '#app p.p2')).toMatch(
        /(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/([12]\d{3}), (0\d|1[0-2]):([0-5]\d):([0-5]\d)\s(AM|PM)/
      )
      expect(await getText(page, '#app p.p3')).toMatch(
        /令和([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3]\d)日([月火水木金土日])曜日 (午前|午後)(\d|1[0-2]):([0-5]\d):([0-5]\d) 協定世界時/
      )
      expect(await getText(page, '#app span.p4')).toMatch(
        /([1-9]|1[0-2])年([1-9]|1[0-2])月([1-9]|[1-3]\d)日([月火水木金土日])曜日 (午前|午後)(\d|1[0-2]):([0-5]\d):([0-5]\d) 協定世界時/
      )
    })
  })
})
