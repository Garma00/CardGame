var express = require('express')
var router = express.Router()
var deck_controller = require('../controller/deck_controller.js')

router.get('/search', deck_controller.findCardByName)

router.post('/deck', deck_controller.newDeck)
router.get('/deck', deck_controller.showDeck)
router.put('/deck', deck_controller.modifyDeck)
router.delete('/deck', deck_controller.deleteDeck)

module.exports=router