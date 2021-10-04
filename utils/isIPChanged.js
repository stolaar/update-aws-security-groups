const getIPAddress = require('./getIPAddress')
const fs = require('fs')

async function isIPChanged() {
  const ipv4 = require('../config/ipv4.json')
  const current = await getIPAddress()
  if (ipv4.current !== current) {
    ipv4.previous = ipv4.current
    ipv4.current = current
    fs.writeFileSync('config/ipv4.json', JSON.stringify(ipv4, null, 2))
  }
  return ipv4.current !== current
}

module.exports = isIPChanged
