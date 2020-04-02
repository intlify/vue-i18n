module.exports = {
  server: {
    command: 'node ./scripts/serve.js'
  },
  launch: {
    dumpio: false,
    headless: process.env.HEADLESS !== 'false'
  },
  browser: 'chromium',
  browserContext: 'default'
}
