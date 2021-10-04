const cron = require('node-cron')
const EditAWSSecurityGroups = require('../../services/EditAWSSecurityGroups')
const isIPChanged = require('../../utils/isIPChanged')

const checkIPTask = cron.schedule(
  '*/5 * * * * *',
  async () => {
    console.log('CHECKING IS IP CHANGED...')
    if (!(await isIPChanged())) {
      console.log('IP CHANGED! UPDATING SECURITY GROUPS')
      try {
        await EditAWSSecurityGroups.getInstance().updateSecurityGroups()
        return
      } catch (err) {
        console.error(err)
        return
      }
    }
    console.log('IP IS NOT CHANGED FROM LAST CHECK')
  },
  { scheduled: true }
)

module.exports = [checkIPTask]
