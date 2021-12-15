const { Sequelize } = require('sequelize')
const db = require('../connection/mysql')

var Failed = db.define(
  'failed',
  {
    message: Sequelize.TEXT,
    sendAt: Sequelize.DATE,
  },
  {
    tableName: 'failed',
  }
)

module.exports = Failed
