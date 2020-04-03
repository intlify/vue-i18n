const setupWarningConsole = (page, messages) => {
  messages.length = 0
  page.on('console', msg => {
    if (msg.type() === 'warning') {
      messages.push(msg.text())
    }
  })
}

module.exports = {
  setupWarningConsole
}
