const keys = require('./config/keys')
const {
  authorizeSecurityGroupsIngress,
  revokeSecurityGroupsIngress
} = require('./utils/editAWSSecurityGroups')

async function updateSecurityGroups() {
  const { current, previous } = await keys.ipv4()
  const promises = keys.securityGroups.ids().map(async securityGroupId => {
    if (previous) {
      await revokeSecurityGroupsIngress(securityGroupId, previous)
    }
    return await authorizeSecurityGroupsIngress(securityGroupId, current)
  })
  return Promise.all(promises)
}

updateSecurityGroups()
  .then(() => console.log('UPDATED'))
  .catch(err => console.error('ERROR', err))