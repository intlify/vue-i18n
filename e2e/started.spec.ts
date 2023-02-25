import { getText } from './helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(`http://localhost:8080/examples/${pattern}/started.html`)
    })

    test('initial rendering', async () => {
      expect(await getText(page, 'label')).toMatch('言語')
      expect(await getText(page, 'p')).toMatch('こんにちは、世界！')
    })

    test('change locale', async () => {
      await page.selectOption('#app select', 'en')
      expect(await getText(page, 'label')).toMatch('Language')
      expect(await getText(page, 'p')).toMatch('hello world!')
    })
  })
})
