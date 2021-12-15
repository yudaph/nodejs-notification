# How to use

## 1. setup db connection

setup db connection in `connection/mysql.js`

```
module.exports = new Sequelize(<db_name>, <db_user>, <db_password>, {
host: <db_host>,
dialect: 'mysql',
```

## 2. run server.js

you can use this command on root folder

```
node server.js
```
