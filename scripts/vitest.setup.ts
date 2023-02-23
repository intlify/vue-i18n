import { afterAll, beforeAll } from 'vitest'
import playwright from 'playwright'

import type { LaunchOptions } from 'playwright'

beforeAll(async () => {
  const type = process.env.E2E_BROWSER || 'chromium'
  const launchOptions: LaunchOptions = { headless: true }
  if (!process.env.CI && !process.env.E2E_BROWSER) {
    launchOptions.channel = 'chrome'
  }

  global.browser = await playwright[type].launch(launchOptions)
  global.page = await global.browser.newPage()
})

afterAll(async () => {
  await global.page?.close()
  await global.browser?.close()
})
