const { Sequelize } = require('sequelize')
const db = require('../connection/mysql')

var User = db.define(
  'user',
  {
    first_name: Sequelize.STRING(40),
    last_name: Sequelize.STRING(40),
    birth_date: Sequelize.DATEONLY,
    location: Sequelize.STRING(50),
    deleteAt: Sequelize.DATE,
  },
  {
    tableName: 'user',
  }
)

module.exports = User
