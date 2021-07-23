;['composition', 'petite', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/functions/plural.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('car')
      await expect(page).toMatch('cars')
      await expect(page).toMatch('no apples')
      await expect(page).toMatch('one apple')
      await expect(page).toMatch('10 apples')
      await expect(page).toMatch('1 banana')
      await expect(page).toMatch('too many bananas')
    })
  })
})
