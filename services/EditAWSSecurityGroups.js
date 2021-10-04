const {
  AuthorizeSecurityGroupIngressCommand,
  RevokeSecurityGroupIngressCommand,
  EC2Client
} = require('@aws-sdk/client-ec2')
const ec2 = new EC2Client()
const keys = require('../config/keys')
const getGitUsername = require('../utils/getGitUsername')

class EditAWSSecurityGroups {
  static getInstance() {
    if (!EditAWSSecurityGroups.instance) {
      EditAWSSecurityGroups.instance = new EditAWSSecurityGroups()
    }
    return EditAWSSecurityGroups.instance
  }

  async authorizeSecurityGroupsIngress(
    securityGroupId,
    ipAddress,
    description = 'FROM NODE APP',
    numOfAttempts = 3
  ) {
    const command = new AuthorizeSecurityGroupIngressCommand({
      GroupId: securityGroupId,
      IpPermissions: [
        {
          FromPort: 22,
          ToPort: 22,
          IpProtocol: 'tcp',
          IpRanges: [
            {
              CidrIp: ipAddress + '/32',
              Description: description.toString().trim()
            }
          ]
        }
      ]
    })
    try {
      await ec2.send(command)
      return
    } catch (err) {
      if (numOfAttempts > 0) {
        return this.authorizeSecurityGroupsIngress(
          securityGroupId,
          ipAddress,
          description,
          --numOfAttempts
        )
      }
      throw err.message
    }
  }

  async revokeSecurityGroupsIngress(securityGroupId, ipAddress) {
    const command = new RevokeSecurityGroupIngressCommand({
      GroupId: securityGroupId,
      IpPermissions: [
        {
          FromPort: 22,
          ToPort: 22,
          IpProtocol: 'tcp',
          IpRanges: [
            {
              CidrIp: ipAddress + '/32'
            }
          ]
        }
      ]
    })
    try {
      await ec2.send(command)
      return
    } catch (err) {
      throw err.message
    }
  }

  async updateSecurityGroups() {
    const { current, previous } = keys.ipv4
    const username = await getGitUsername()
    const promises = keys.securityGroups.ids().map(async securityGroupId => {
      if (previous) {
        await this.revokeSecurityGroupsIngress(securityGroupId, previous)
      }
      return await this.authorizeSecurityGroupsIngress(
        securityGroupId,
        current,
        username
      )
    })
    return Promise.all(promises)
  }
}

module.exports = EditAWSSecurityGroups
