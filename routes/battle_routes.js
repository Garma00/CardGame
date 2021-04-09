var express = require('express')
var battle_controller = require('../controller/battle_controller.js')
var router = express.Router()

router.get('/battle', battle_controller.joinBattle)
router.post('/battle', battle_controller.createBattle)
router.put('/battle', battle_controller.updateBattle)
router.delete('/battle', battle_controller.endBattle)

module.exports=router