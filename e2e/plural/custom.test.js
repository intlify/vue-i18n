;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/plural/custom.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('1 машина')
      await expect(page).toMatch('2 машины')
      await expect(page).toMatch('4 машины')
      await expect(page).toMatch('12 машин')
      await expect(page).toMatch('21 машина')
      await expect(page).toMatch('нет бананов')
      await expect(page).toMatch('4 банана')
      await expect(page).toMatch('11 бананов')
      await expect(page).toMatch('31 банан')
    })
  })
})
