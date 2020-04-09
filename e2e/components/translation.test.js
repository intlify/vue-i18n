;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/components/translation.html`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch('こんにちは、kazupon！')
      await expect(page).toMatch('hello, English!')
      await expect(page).toMatch('こんにちは、かずぽん！ ごきげんいかが？')
      await expect(page).toMatch('2 bananas')
    })
  })
})
