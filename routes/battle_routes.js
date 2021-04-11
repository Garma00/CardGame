var express = require('express')
var battle_controller = require('../controller/battle_controller.js')
var router = express.Router()
//spostare operazioni che reindirizzano a pagine ejs in altri link
//scrivere delle get che ritornano json con dati interessati
router.get('/match', battle_controller.joinBattle)

//ritorna dati relativi ad una battaglia
//router.get('/battle', battle_controller.detBattle)
router.post('/battle', battle_controller.createBattle)
router.put('/battle', battle_controller.updateBattle)
router.delete('/battle', battle_controller.endBattle)

module.exports=router