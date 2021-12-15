const catchAsync = require('../utils/catchAsync')
const moment = require('moment-timezone')
const axios = require('axios')
const db = require('../connection/mysql')
const Failed = require('../model/failed')
const { QueryTypes, Op } = require('sequelize')

exports.annualEvent = async (message, field, datenow) => {
  try {
    //Get All location
    let timezones = await db.query(
      'SELECT location FROM `user` GROUP BY location',
      {
        type: QueryTypes.SELECT,
      }
    )
    timezonesonnine = []
    let month, day
    // check all timezione where currently at 9.00
    timezones.forEach((elem) => {
      const now = moment.tz(datenow, elem.location).format('DD MM HH mm')
      let [d, m, hour, minute] = now.split(' ')
      month = m
      day = d
      if (hour == 9 && minute < 30) {
        timezonesonnine.push(elem.location)
      }
    })

    if (timezonesonnine.length > 0) {
      const users = await db.query(
        `SELECT first_name, last_name FROM \`user\` 
    WHERE location IN (:timezonesonnine) 
    and month(${field}) = :month 
    and day(${field}) = :day`,
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
    }
  } catch (error) {
    console.error(error)
  }
}

exports.failed = async () => {
  try {
    const faileds = await Failed.findAll({
      where: {
        sendAt: {
          [Op.is]: null,
        },
      },
    })

    faileds.forEach((e) => {
      let url = 'https://hookb.in/qByKB83ZxkhEwPllwJor'
      axios
        .post(url, {
          message: e.message,
        })
        .then(async function (response) {
          e.sendAt = new Date()
          await e.save()
        })
        .catch(async function (error) {
          console.error('error', error)
        })
    })
  } catch (error) {
    console.error(error)
  }
}
