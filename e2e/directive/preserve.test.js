const { sleep } = require('../helper') // eslint-disable-line

;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/directive/preserve.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatch('hi there!')
    })

    test('trigger transition', async () => {
      await expect(page).toClick('#app button')
      await expect(page).toMatchElement('#app p', { text: 'hi there!' })
      await sleep(1000)
      await expect(page).toClick('#app button')
      await expect(page).toMatch('hi there!')
    })
  })
})
