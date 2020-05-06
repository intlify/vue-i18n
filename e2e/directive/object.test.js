;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/directive/object.html`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch('こんにちは、 kazupon！')
      await expect(page).toMatch('good bye!')
    })
  })
})
