;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/components/translation/basic.html`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch('こんにちは、kazupon！')
      await expect(page).toMatch('hello, English!')
    })
  })
})
