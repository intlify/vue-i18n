import { getText } from '../../helper'
describe(`bridge: translation component`, () => {
  beforeAll(async () => {
    await page.goto(
      `http://localhost:8080/examples/bridge/composition/components/translation.html`
    )
  })

  test('rendering', async () => {
    expect(await getText(page, '#app p.name')).toMatch('こんにちは、kazupon！')
    expect(await getText(page, '#app p.list')).toMatch('hello, English!')
    expect(await getText(page, '#app p.linked')).toMatch(
      'こんにちは、かずぽん！ ごきげんいかが？'
    )
    expect(await getText(page, '#app p.plural')).toMatch('no bananas')
  })

  test('change quantity', async () => {
    await page.selectOption('#app select', '1')
    expect(await getText(page, '#app p.plural')).toMatch('1 banana')
    await page.selectOption('#app select', '2')
    expect(await getText(page, '#app p.plural')).toMatch('2 bananas')
    await page.selectOption('#app select', '0')
    expect(await getText(page, '#app p.plural')).toMatch('no bananas')
  })
})
