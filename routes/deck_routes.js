var express = require('express')
var router = express.Router()
var deck_controller = require('../controller/deck_controller.js')

router.post('/deck', deck_controller.newDeck)

module.exports=router