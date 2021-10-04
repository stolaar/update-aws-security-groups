const ipv4 = require('./ipv4.json')

module.exports = {
  securityGroups: {
    ids: function () {
      const { SECURITY_GROUP_IDS = '' } = process.env
      return SECURITY_GROUP_IDS.split(',').filter(val => val)
    }
  },
  ipv4
}
