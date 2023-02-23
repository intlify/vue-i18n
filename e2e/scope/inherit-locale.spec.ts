import { getText } from '../helper'
;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/scope/inherit-locale.html`
      )
    })

    test('initial rendering', async () => {
      expect(await getText(page, '#app p.parent')).toMatch('こんにちは、世界！')
      expect(await getText(page, '#app p.child')).toMatch('やあ！')
      expect(await getText(page, '#app label[for=checkbox]')).toMatch(
        'root から locale を継承する'
      )
    })

    test('change locale', async () => {
      // root
      await page.selectOption('#app select', 'en')
      expect(await getText(page, '#app p.parent')).toMatch('hello world!')
      expect(await getText(page, '#app p.child')).toMatch('Hi there!')
      expect(await getText(page, '#app label[for=checkbox]')).toMatch(
        'Inherit locale from root'
      )

      // Child
      await page.selectOption('#app div.child select', 'ja')
      expect(await getText(page, '#app p.parent')).toMatch('hello world!')
      expect(await getText(page, '#app p.child')).toMatch('やあ！')
      expect(await getText(page, '#app label[for=checkbox]')).toMatch(
        'root から locale を継承する'
      )

      // checkbox off
      await page.click('#checkbox')
      await page.selectOption('#app select', 'ja')
      await page.selectOption('#app select', 'en')
      expect(await getText(page, '#app p.parent')).toMatch('hello world!')
      expect(await getText(page, '#app p.child')).toMatch('やあ！')
      expect(await getText(page, '#app label[for=checkbox]')).toMatch(
        'root から locale を継承する'
      )

      // checkbox on
      await page.click('#checkbox')
      await page.selectOption('#app select', 'ja')
      await page.selectOption('#app select', 'en')
      expect(await getText(page, '#app p.parent')).toMatch('hello world!')
      expect(await getText(page, '#app p.child')).toMatch('Hi there!')
      expect(await getText(page, '#app label[for=checkbox]')).toMatch(
        'Inherit locale from root'
      )
    })
  })
})
