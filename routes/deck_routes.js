var express = require('express')
var router = express.Router()
var deck_controller = require('../controller/deck_controller.js')

router.get('/search', deck_controller.findCardByName)
//renderizza alla pagina con le statistiche del mazzo
router.get('/mazzo', deck_controller.showDeck)
router.get('/:username/deck/:deck', deck_controller.getDeck) //ritorna il deck richiesto
router.get('/:username/deck/', deck_controller.getUserDecks) //ritorna tutti i deck di un user

router.get('/deck', deck_controller.getDecks)//ritorna tutti i mazzi
router.post('/deck', deck_controller.newDeck) //ritorna il mazzo e l'utente
router.put('/deck', deck_controller.modifyDeck)//permette di aggiungere o rimuovere carte
router.delete('/deck', deck_controller.deleteDeck) //ritorna il mazzo rimosso

module.exports=router
