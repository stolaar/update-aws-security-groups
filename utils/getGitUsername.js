const { spawn } = require('child_process')

function getGitUsername() {
  return new Promise(fulfil => {
    const process = spawn('git', ['config', 'user.name'])
    process.stdout.on('data', data => fulfil(data.toString()))
    process.on('close', () => fulfil(''))
    process.on('exit', () => fulfil(''))
    process.on('error', () => fulfil(''))
  })
}

module.exports = getGitUsername
