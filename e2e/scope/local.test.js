;['composable', 'legacy'].forEach(pattern => {
  describe(`${pattern}`, () => {
    beforeAll(async () => {
      await page.goto(
        `http://localhost:8080/examples/${pattern}/scope/local.html`
      )
    })

    test('initial rendering', async () => {
      await expect(page).toMatchElement('#app p', {
        text: 'こんにちは、世界！'
      })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'やあ！'
      })
    })

    test('change locale', async () => {
      // root
      await expect(page).toSelect('#app select', 'en')
      await expect(page).toMatchElement('#app p', { text: 'hello world!' })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'Hi there!'
      })

      // Child
      await expect(page).toSelect('#app div.child select', 'ja')
      await expect(page).toMatchElement('#app p', { text: 'hello world!' })
      await expect(page).toMatchElement('#app div.child p', {
        text: 'やあ！'
      })
    })
  })
})
