const express = require('express')
var bodyParser = require('body-parser')
const db = require('./model/db.js')
var user_routes = require('./routes/user_routes.js')
var user_controller = require('./controller/user_controller')
const cors = require('cors');
const cookieParser = require('cookie-parser');
var deck_routes = require('./routes/deck_routes.js')
var battle_routes = require('./routes/battle_routes.js')
var trade_routes = require('./routes/trade_routes.js')
require('dotenv').config();
var app = express()

const port = 3000;//porta sulla quale sarà in ascolto il server

//middleware

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())

app.use(express.static('public'))
app.set('view engine', 'ejs')

//##############################################

//sezione routes

app.use(user_routes)
app.use(deck_routes)
app.use(battle_routes)
app.use(trade_routes)

app.listen(port, function()
{
	console.log("App listening on --> " + port)
	//appena viene aperto il servero ccorre connettersi al db
	//altrimenti dovrei connettermi ogni volta che voglio fare una query
	db.connection.connect(function(err)
	{
		if(err)
			console.log("Cannot connect to db --> " + err)
		else
			console.log("Connected to db")
	})
})

exports.app = app
