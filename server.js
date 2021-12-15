const app = require('./app')
const schedule = require('node-schedule')
const notif = require('./controller/notifController')

const db = require('./connection/mysql')

db.authenticate()
  .then(async () => {
    await db.sync()
    console.log('Database connected...')
  })
  .catch((err) => console.log('Error: ' + err))

app.listen(8000, function () {
  console.log('Server started on port 8000')
})

schedule.scheduleJob('*/30 * * * *', function () {
  var datenow = new Date()
  notif.failed()
  notif.annualEvent(
    'Hey, {full_name} it’s your birthday',
    'birth_date',
    datenow
  )
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION !! Mematikan server...')
  console.log(err)
  server.close(() => {
    process.exit(1)
  })
})

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED REJECTION !! Mematikan server...')
  console.log(err)
  server.close(() => {
    process.exit(1)
  })
})
