const {
  AuthorizeSecurityGroupIngressCommand,
  RevokeSecurityGroupIngressCommand,
  EC2Client
} = require('@aws-sdk/client-ec2')
const ec2 = new EC2Client()

module.exports = {
  authorizeSecurityGroupsIngress: function (
    securityGroupId,
    ipAddress,
    description = 'FROM NODE APP'
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
              Description: description
            }
          ]
        }
      ]
    })
    return ec2.send(command)
  },
  revokeSecurityGroupsIngress: async function (securityGroupId, ipAddress) {
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
    return ec2.send(command)
  }
}
