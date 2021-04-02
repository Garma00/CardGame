var express = require('express')
var router = express.Router()
var user_controller = require('../controller/user_controller.js')

router.get('/submit', user_controller.submitPage)
router.post('/submit', user_controller.newAccount)
router.post('/login', user_controller.startSession)
router.get('/dashboard', user_controller.dashboardPage)
router.get('/', user_controller.home)

module.exports=router