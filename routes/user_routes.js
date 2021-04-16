var express = require('express')
var router = express.Router()
var user_controller = require('../controller/user_controller.js')

router.get('/submit', user_controller.submitPage)
//renderizza al profilo di un utente
router.get('/profile', user_controller.getProfile)
router.get('/user/:username', user_controller.getUser)   //ritorna l'user 
router.post('/user', user_controller.newAccount) //crea un nuovo utente e lo ritorna 
router.post('/login', user_controller.startSession) //ritorna il jwt

router.get('/dashboard', user_controller.dashboardPage)
router.get('/', user_controller.home)

module.exports=router
