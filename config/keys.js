const fs = require('fs')
const getIPAddress = require('../utils/getIPAddress')

module.exports = {
  securityGroups: {
    ids: function () {
      const { SECURITY_GROUP_IDS = '' } = process.env
      return SECURITY_GROUP_IDS.split(',').filter(val => val)
    }
  },
  ipv4: async function () {
    const ipv4 = require('./ipv4.json')
    const current = await getIPAddress()

    if (ipv4.current !== current) {
      ipv4.previous = ipv4.current
      ipv4.current = current
      fs.writeFileSync('config/ipv4.json', JSON.stringify(ipv4, null, 2))
    }
    return ipv4
  }
}
