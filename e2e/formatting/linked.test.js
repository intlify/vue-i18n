;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/formatting/linked.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('DIO: the world !!!!')
      await expect(page).toMatch('Please provide home address')
      await expect(page).toMatch('custom modifiers example: snake-case')
    })

    test('change locale', async () => {
      await page.select('#app select', 'ja')
      await expect(page).toMatch('ディオ: ザ・ワールド ！！！！')
      await expect(page).toMatch('どうか、ホームアドレス を提供してください。')
      await expect(page).toMatch('カスタム修飾子の例: スネーク-ケース')
    })
  })
})
