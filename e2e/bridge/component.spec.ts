import { getText } from '../helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/bridge/${pattern}/component.html`
      )
    })

    test('rendering', async () => {
      expect(await getText(page, '#app p')).toMatch('こんにちは、かずぽん！')
    })
  })
})
