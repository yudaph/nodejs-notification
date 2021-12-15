const catchAsync = require('../utils/catchAsync')

const db = require('../connection/mysql')
const { QueryTypes, Op } = require('sequelize')
const User = require('../model/user')
const AppError = require('../utils/appError')
const Failed = require('../model/failed')

exports.getUser = catchAsync(async (req, res, next) => {
  if (req.body.in == '') {
    req.body.in = "''"
  }

  const query = `SELECT * FROM user`
  const getData = await db.query(query, {
    type: QueryTypes.SELECT,
  })

  const data = getData

  res.status(200).json(data)
})

exports.save = catchAsync(async (req, res, next) => {
  let newUser = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    birth_date: req.body.birth_date,
    location: req.body.location,
  })
  res.status(200).json(newUser)
})

exports.delete = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ id: req.params.id })
  if (!user) {
    return next(new AppError('user not found', 404))
  }
  user.deleteAt = new Date()
  await user.save()
  res.status(200).json(user)
})

exports.event = catchAsync(async (req, res, next) => {
  let message = 'Hey, {full_name} it’s your birthday'
  var datenow = moment.tz('2021-10-28 09:02', 'Asia/Jakarta')
  let timezones = await db.query(
    'SELECT location FROM `user` GROUP BY location',
    {
      type: QueryTypes.SELECT,
    }
  )
  timezonesonnine = []
  let month, day
  timezones.forEach((elem) => {
    const now = moment.tz(datenow, elem.location).format('DD MM HH mm')
    let [d, m, hour, minute] = now.split(' ')
    month = m
    day = d
    if (hour == 9 && minute < 30) {
      timezonesonnine.push(elem.location)
    }
  })

  const users = await db.query(
    'SELECT first_name, last_name FROM `user` WHERE location IN (:timezonesonnine) and month(birth_date) = :month and day(birth_date) = :day',
    {
      replacements: {
        timezonesonnine,
        month,
        day,
      },
      type: QueryTypes.SELECT,
    }
  )

  users.forEach((e) => {
    let msg = message
      .replace('{full_name}', `${e.first_name} ${e.last_name}`)
      .replace('{first_name}', e.first_name)
      .replace('{last_name}', e.last_name)
    console.log(msg)
    axios
      .post('https://hookb.in/qByKB83ZxkhEwPllwJor', {
        message: msg,
      })
      .then(function (response) {
        console.log(response.status)
      })
      .catch(async function (error) {
        await Failed.create({
          message: msg,
        })
        console.log('error')
      })
  })
  res.status(200).json(timezonesonnine)
})

exports.failed = catchAsync(async (req, res, next) => {
  const faileds = await Failed.findAll({
    where: {
      sendAt: {
        [Op.is]: null,
      },
    },
  })

  faileds.forEach((e) => {
    let url = e.id == 6 ? '' : 'https://hookb.in/qByKB83ZxkhEwPllwJor'
    axios
      .post(url, {
        message: e.message,
      })
      .then(async function (response) {
        e.sendAt = new Date()
        await e.save()
      })
      .catch(async function (error) {
        console.log('error')
      })
  })
  res.status(200).json(faileds)
})
