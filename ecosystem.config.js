module.exports = {
  apps: [
    {
      name: 'Development',
      script: './index.js',
      instances: 1,
      node_args: '-r dotenv/config'
    }
  ]
}
