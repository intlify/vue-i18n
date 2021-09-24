;['composition', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/bridge/${pattern}/component.html`
      )
    })

    test('rendering', async () => {
      await expect(page).toMatch('こんにちは、かずぽん！')
    })
  })
})
