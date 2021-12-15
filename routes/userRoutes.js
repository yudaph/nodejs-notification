const express = require('express')
const userController = require('./../controller/userController')
const router = express.Router()

router.route('/').post(userController.save).get(userController.getUser)
router.route('/:id').delete(userController.delete)

module.exports = router
