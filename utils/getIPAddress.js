const { execSync, spawn } = require('child_process')

function getIPAddress() {
  return new Promise(fulfil => {
    const process = spawn('curl', ['ifconfig.me'])
    process.stdout.on('data', data => fulfil(data.toString()))
    process.on('close', () => fulfil(''))
    process.on('exit', () => fulfil(''))
    process.on('error', () => fulfil(''))
  })
}

module.exports = getIPAddress
