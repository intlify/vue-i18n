const setupWarningConsole = (page, messages) => {
  messages.length = 0
  page.on('console', msg => {
    if (msg.type() === 'warning') {
      messages.push(msg.text())
    }
  })
}

async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

module.exports = {
  setupWarningConsole,
  sleep
}
