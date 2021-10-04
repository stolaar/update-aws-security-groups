const {
  AuthorizeSecurityGroupIngressCommand,
  RevokeSecurityGroupIngressCommand,
  EC2Client,
  EC2
} = require('@aws-sdk/client-ec2')
const AWS = require('aws-sdk')
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
    profile,
    numOfAttempts = 3
  ) {
    process.env.AWS_PROFILE = profile
    const ec2 = new EC2()
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
          profile,
          --numOfAttempts
        )
      }
      throw err.message
    }
  }

  async revokeSecurityGroupsIngress(securityGroupId, ipAddress, profile) {
    process.env.AWS_PROFILE = profile
    const ec2 = new EC2Client()
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
    const {
      ipv4: { current, previous },
      securityGroups: { profiles }
    } = keys
    const username = await getGitUsername()

    const profilePromises = profiles().map(async profile => {
      const promises = keys.securityGroups
        .ids(profile)
        .map(async securityGroupId => {
          if (previous) {
            await this.revokeSecurityGroupsIngress(
              securityGroupId,
              previous,
              profile
            )
          }
          return await this.authorizeSecurityGroupsIngress(
            securityGroupId,
            current,
            username,
            profile
          )
        })
      return await Promise.all(promises)
    })

    await Promise.all(profilePromises)
  }
}

module.exports = EditAWSSecurityGroups
