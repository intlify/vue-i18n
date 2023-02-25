import { getText } from '../../helper'
;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/bridge/${pattern}/scope/global.html`
      )
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p.parent')).toMatch('こんにちは、世界！')
      expect(await getText(page, '#app p.child')).toMatch('こんにちは！')
      expect(await getText(page, '#app p.sub-child')).toMatch('こんにちは！')
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en')
      expect(await getText(page, '#app p.parent')).toMatch('hello world!')
      expect(await getText(page, '#app p.child')).toMatch('Hi !')
      expect(await getText(page, '#app p.sub-child')).toMatch('Hi !')

      await page.selectOption('#app div.sub-child select', 'ja')
      expect(await getText(page, '#app p.parent')).toMatch('こんにちは、世界！')
      expect(await getText(page, '#app p.child')).toMatch('こんにちは！')
      expect(await getText(page, '#app p.sub-child')).toMatch('こんにちは！')
    })
  })
})
