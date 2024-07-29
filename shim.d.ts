import type { Browser, Page } from 'playwright-core'

declare global {
  namespace globalThis {
    var browser: Browser
    var page: Page
  }

  namespace NodeJS {
    interface ProcessEnv {
      E2E_BROWSER?: 'chromium' | 'firefox' | 'webkit'
      CI?: string
      GITHUB_ACTIONS?: string
    }
  }
}

export {}
