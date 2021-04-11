var express = require('express')
var router = express.Router()
var deck_controller = require('../controller/deck_controller.js')

router.get('/search', deck_controller.findCardByName)
//spostare operazioni che reindirizzano a pagine ejs in altri link
//scrivere delle get che ritornano json con dati interessati


//renderizza alla pagina con le statistiche del mazzo
router.get('/mazzo', deck_controller.showDeck)

//router.get('/deck', deck_ontroller.getDeck)
router.post('/deck', deck_controller.newDeck)
router.put('/deck', deck_controller.modifyDeck)
router.delete('/deck', deck_controller.deleteDeck)

module.exports=router