const { Sequelize } = require('sequelize')
module.exports = new Sequelize('s', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
})
