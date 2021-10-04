const tasks = require('./jobs/cron/checkIPAddress')

tasks.forEach(task => task.start())
