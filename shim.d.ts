import type { Browser, Page } from 'playwright'

declare global {
  namespace globalThis {
    var browser: Browser
    var page: Page
  }

  namespace NodeJS {
    interface ProcessEnv {
      E2E_BROWSER?: 'chromium' | 'firefox' | 'webkit'
      CI?: string
    }
  }
}

export {}
