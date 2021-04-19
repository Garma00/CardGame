var express = require('express')
var trade_controller = require('../controller/trade_controller.js')
var router = express.Router()

router.get('/tradePage', trade_controller.tradePage)

router.get('/trade/', trade_controller.getTrades)                    //ritorna tutti i trade    
router.post('/trade/', trade_controller.newTrade)          //crea un nuovo trade 
router.delete('/trade/', trade_controller.deleteTrade)           //elimina il trade specifico

module.exports=router
