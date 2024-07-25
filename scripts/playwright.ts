async function main() {
  try {
    await import('playwright-core')
  } catch (e) {
    console.error(
      'Playwright is not installed. Please run `pnpm playwright-core install chromium`'
    )
    throw e
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
