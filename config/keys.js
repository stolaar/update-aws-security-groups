const ipv4 = require('./ipv4.json')

module.exports = {
  securityGroups: {
    ids: function (profile) {
      const ids = process.env['SECURITY_GROUP_IDS_' + profile] || ''
      return ids.split(',').filter(val => val)
    },
    profiles: function () {
      const { PROFILES = '' } = process.env
      return PROFILES.split(',').filter(val => val)
    }
  },
  ipv4
}
