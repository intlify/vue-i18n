import { getText } from './helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8080/examples/${pattern}/datetime.html`)
    })

    test('initial rendering', async () => {
      const text = await getText(page, 'p')
      expect(text).include('現在の日時')
      expect(text).toMatch(
        /([12]\d{3}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])) (午前|午後)(0[0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9])/
      )
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en-US')
      const text = await getText(page, 'p')
      expect(text).include('Current Datetime')
      // TOOD:
      //  skip this assertions because of the timezone issue
      //  https://github.com/nodejs/node/issues/46123
      // expect(text).toMatch(
      //   /(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/([12]\d{3}), (0[0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) (AM|PM)/
      // )
    })
  })
})
