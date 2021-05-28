var express = require('express')
var users = require('../model/user_model')
var deck = require('../model/deck_model.js')
var battle = require('../model/battle_model.js')
var card = require('../model/cards_model.js')
var bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var util = require('../utility.js')

//renderizza al profilo di un utente non loggato
async function getProfile(req, res)
{
	await util.isLogged(req, res)
	util.trackRequest('/profile', req)
	var user = await getUserData(req.query.username)
	if(user)
	{
		res.status(200).render('profile.ejs', user)
		return true
	}
	else
	{
		res.status(404).json({message: "utente non trovato"})
		return false
	}
}

//restituisce l'utente rischiesto sotto forma di json
async function getUser(req, res)
{
	util.trackRequest('/user', req)
	var response = await getUserData(req.params.username)
    if(!response)
        res.status(400).json({message: 'utente non presente'})
	res.status(200).json(response)
	return true
}

//ritorna un ogetto contenente tutte le informazioni dell'utente passato come parametro
async function getUserData(username)
{
	var user = await users.getByUsername(username)
	if(!user)
		return false
	var decks = await deck.getOwnersDeck(username)
	var array = []
	//per ogni mazzo creo un ogetto contenente il nome e la lista di carte
	if(decks)
	{
		for(var i = 0; i < decks.length; i++)
		{
			var rows = await card.getFromDeck(decks[i].name, user[0].username)
			var obj=
			{
				name: decks[i].name,
				cards: rows
			}

			array[i] = obj
		}		
	}

	var matches = await battle.getEndedGames(username)
	var used = await await deckUsed(username) 
	var win = await battle.getWin(username)
	var lose = await battle.getLose(username)
	var winrate = (win / (win + lose)) * 100
	var user = 
	{
		username: user[0].username,
		win: win,
		lose: lose,
		winrate: winrate + "%",
		games: matches,
		used: used,
		decks: array
	}

	return user
}

/*
1. controlli sui parametri passati in modo che non siano vuoti
2.controllo sull'username in modo che sia univoco
3.ritorno alla pagina(se non passano i due controlli ritorno
alla pagina di registrazione con un messaggio di errore, 
altrimenti ritorno al profilo dell'utente)
*/
async function newAccount(req, res)
{
	util.trackRequest('/user', req)
	var username = req.body.username
	var password = req.body.password
	if(username == null || password == null)
	{
		//l'utente ha lasciato almeno un campo vuoto 
		res.status(400).json({message: "uno o più campi vuoti"})
	}
	else
	{
		var rows = await users.getByUsername(username)
		if(rows)
		{
			//username già preso
			res.status(410).json({message: "username già preso"})
		}
		else
		{
			//username disponibile, inserisco l'utente nel db
			var hash = await hashPassword(password)
			if(hash == null)
			{
                res.status(400).json({message: "impossibile registrarsi, riprova."})
				return false;
			}
			else
			{
				var result = await users.insert(username, hash)
				if(result)
					res.status(200).json({user: username})
			}
		}
	}
}

//prende in input il plain text e ritorna il digegst
async function hashPassword(password)
{
	const salt = 10;
	var p = new Promise(function(resolve, reject)
	{
		bcrypt.hash(password, salt, function(err, hash)
		{
			if(err)
				return reject(err)
			else
			{
				password = hash;
				return resolve(password)
			}
		})
	})
	try
	{
		var pw = await p
		return pw
	}
	catch(err)
	{
		console.log("hash password fallito " + err)
	}
}

/*
chiamata per eseguire il login dell'utente
1.controllo che i due campi del form non siano vuoti
2.controllo che username e password siano corretti
3.se va tutto bene ritorno il token
*/
async function startSession(req, res)
{
	
	var username = req.body.username
	var password = req.body.password
	util.trackRequest('/login', req)
    var rows = await users.getByUsername(username)
    if(rows)
    {
        var result = await comparePw(password, rows[0].password)
        if(result)
        {
            //genero un JWT
            var response = util.generateToken(res, username)
            res.status(200).send(response.req.cookies.token)
            return true
        }
        else
        {
            res.status(401).json({message: "invalid account"})
            return false
        }
    }
    else
    {
        res.status(401).json({message: "invalid account"})
        return false
    }
}

/*prende in input plain text e digest, ritorna true o false se 
la comparazione va a buon fine o meno*/
async function comparePw(password, hash)
{
	var p = new Promise(function(resolve, reject)
	{
		bcrypt.compare(password, hash, function(err, result)
		{
			if(err)
				console.log("impossibile il controllo tra password --> " + err)
			if(result)
				resolve(result)
			else
				reject(result)
		})
	})
	try
	{
		var result =  await p
		return true
	}
	catch(err)
	{
		return false
	}
}

//renderizza alla pagina di registrazione
function submitPage(req, res)
{
	//ritorno la pagina di submnit
	util.trackRequest('/submit', req)
	res.render('submit.ejs', {})
}

//renderizza alla pagina di login
function home(req, res)
{
	util.trackRequest('/', req)
	res.render("login.ejs", {})
}

/*
per ogni deck posseduto dell'utente passato controllo 
il numero di volte che lo ha utilizzato nelle partite già concluse
*/
async function deckUsed(user)
{
	var decks = await deck.getOwnersDeck(user)
	var used = []

	if(!decks)
		return false
	
	for(i = 0; i < decks.length; i++)
		used[i] = await battle.getByDeckUsed(decks[i].name, user)

	return used
}

//dopo aver raccolto tutti i dati relativi all'utente renderizzo alla dashboard
async function dashboardPage(req, res)
{
    if(!await util.isLogged(req, res))
        return false
	//util.trackRequest('/dashboard', req)
	//raccolgo tutti i dati necessari
	var decks = await deck.getOwnersDeck(req.user.username)		
	var games = await battle.getEndedGames(req.user.username)	 
	var win = await battle.getWin(req.user.username)			
	var lose = await battle.getLose(req.user.username)			 
	var used = await deckUsed(req.user.username)				
	var obj = 
	{
		username: req.user.username,	
		decks: decks,	//deck posseduti
		games: games,	//partite giocate
		win: win,		//partite vinte
		lose: lose,		//partite perse
		used: used 		//numero di volte in cui ha usato ogni deck 
	}
    res.status(200).render('dashboard.ejs', obj)
	return true
}

module.exports={getProfile, getUser, startSession, newAccount, submitPage, home, dashboardPage}
