;['composition', 'legacy'].forEach(pattern => {
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
      await expect(page).toMatch('no bananas')
    })

    test('change quantity', async () => {
      await page.select('#app select', '1')
      await expect(page).toMatch('1 banana')
      await page.select('#app select', '2')
      await expect(page).toMatch('2 bananas')
      await page.select('#app select', '0')
      await expect(page).toMatch('no bananas')
    })
  })
})
