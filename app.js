const express = require('express')
const globalErrorController = require('./controller/errorController')
const userRouter = require('./routes/userRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use('/api/v1/user', userRouter)

app.use('/', (req, res, next) => {
  return res.status(200).json({ message: 'welcome' })
})

module.exports = app
