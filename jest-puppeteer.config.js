module.exports = {
  server: {
    command: 'node ./scripts/serve.js'
  },
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false'
  },
  browser: 'chromium',
  browserContext: 'default'
}
