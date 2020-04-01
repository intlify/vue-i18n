import 'expect-puppeteer'

beforeAll(async () => {
  await page.goto('http://localhost:8080/examples/legacy/started.html')
})

test('title', async () => {
  await expect(page).toMatch('こんにちは、世界！')
})
