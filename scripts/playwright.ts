async function main() {
  try {
    // @ts-ignore
    await import('playwright')
  } catch (e) {
    console.error(
      'Playwright is not installed. Please run `pnpm playwright install chromium`'
    )
    throw e
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
