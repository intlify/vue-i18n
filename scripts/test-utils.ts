type TestContext = { url: string }

let currentContext: TestContext | undefined

export function useTestContext(): TestContext {
  recoverContextFromEnv()

  if (!currentContext) {
    throw new Error(
      'No context is available. (Forgot calling setup or createContext?)'
    )
  }
  return currentContext
}

export function setTestContext(context?: TestContext): TestContext | undefined {
  currentContext = context
  return currentContext
}

export function recoverContextFromEnv() {
  if (!currentContext && process.env.INTLIFY_TEST_CONTEXT) {
    setTestContext(JSON.parse(process.env.INTLIFY_TEST_CONTEXT || '{}'))
  }
}

export function exposeContextToEnv() {
  const { url } = currentContext!
  process.env.INTLIFY_TEST_CONTEXT = JSON.stringify({ url })
}
