import { getText, url } from './helper'
;['composition'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(url(`/examples/${pattern}/datetime.html`))
    })

    test('initial rendering', async () => {
      const text = await getText(page, 'p')
      expect(text).include('現在の日時')
      expect(text).toMatch(
        /([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])) (午前|午後)(0\d|1[0-2]):([0-5]\d):([0-5]\d)/
      )
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en-US')
      const text = await getText(page, 'p')
      expect(text).include('Current Datetime')
      expect(text).toMatch(
        /(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/([12]\d{3}), (0\d|1[0-2]):([0-5]\d):([0-5]\d)/
      )
    })
  })
})
