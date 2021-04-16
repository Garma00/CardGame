var express = require('express')
var battle_controller = require('../controller/battle_controller.js')
var router = express.Router()
//spostare operazioni che reindirizzano a pagine ejs in altri link
//scrivere delle get che ritornano json con dati interessati
router.get('/match/:id', battle_controller.renderBattle)

//ritorna dati relativi ad una battaglia
router.get('/:username/battle', battle_controller.getUserBattles) //ritorna tutti i match di un utente
router.get('/battle/:id', battle_controller.getBattle) //ritorna il match richiesto
router.post('/battle', battle_controller.createBattle) //ritorna il match creato
//provvede aggiornamenti alla partita come deck in uso lp attuali e guest in partita 
router.put('/battle', battle_controller.updateBattle) 
router.delete('/battle', battle_controller.endBattle)//ritorna il match chiusto

module.exports=router
