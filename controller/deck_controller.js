var express = require('express')
const axios = require('axios').default;
var util = require('../utility.js')
var deck = require('../model/deck_model.js')
var cards = require('../model/cards_model.js')

async function newDeck(req, res)
{
	var deckName = req.body.deck
	//se l'utente è loggato 
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	//se il nome del deck non è già stato preso dallo stesso utente
	console.log("deck name --> " + deckName)
	var rows = await alreadyHave(deckName, req.user.username)
	
	if(rows)
	{
		res.status(409).send("Questo nome non è più disponibile")
		return false;
	}
	if(deck.insert(deckName, req.user.username))
	{
		console.log("deck inserito con successo")
		res.redirect('/dashboard')
		return true	
	}
	else
		return false	
}

async function alreadyHave(name, user)
{
	var rows = await deck.getByName(name, user)
	if(rows)
		return true
	return false
}

//reindirizza ad una pagina con la lista delle carte presenti 
//nel deck richiesto 
async function showDeck(req, res)
{
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	var deckName = req.query.deckName
	var username = req.user.username
	console.log(username)
	console.log(req.query)
	var rows = await cards.getFromDeck(deckName, username)
	var size = await cards.getDeckLength(deckName, username)
	var spells = await cards.getSizeByType(deckName, username, "spell card")
	var traps = await cards.getSizeByType(deckName, username, "Trap Card")
	var normalMonsters = await cards.getSizeByType(deckName, username, "normal monster")
	var effectMonsters = await cards.getSizeByType(deckName, username, "effect monster")
	var synchroMonsters = await cards.getSizeByType(deckName, username, "synchro monster")
	var tunerMonsters = await cards.getSizeByType(deckName, username, "tuner monster")
	var obj =
	{
		username: req.user.username,
		deck:deckName,
		cards: rows,
		size:size,
		spells:spells,
		traps:traps,
		normalMonsters:normalMonsters,
		effectMonsters:effectMonsters,
		synchroMonsters:synchroMonsters,
		tunerMonsters:tunerMonsters

	}
	res.render('deck.ejs', obj)

}
//chiamata quando viene effettuata una put
async function modifyDeck(req, res)
{

	console.log("modify deck")
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}

	switch(parseInt(req.body.type))
	{
		case 0:
			console.log("try to add card")
			await addCard(req, res)
			break;
		default:
			console.log("default")
			break;
	}

	return true
}	

async function addCard(req, res)
{
	var toInsert = req.body.card
	var deck = req.body.deck
	var username = req.user.username

	console.log(toInsert.name + " " + deck + " " + username)

	console.log("server side i want to insert --> " + toInsert.name)
	//controllo se la carta non è stata iserita 3 volte
	var rows = await cards.getCardFromDeck(toInsert.name, deck, username)
	if(rows)
	{
		//controllo il numero di copie della carta presenti nel mazzo
		var copies = await cards.getCopiesNumber(toInsert.name, deck, username)
		console.log(copies)
		if(copies >= 3)
		{
			//numero di copie massimo raggiunto
			console.log("numero di copie massimo raggiunto per --> " + toInsert.name)
			return false
		}
		else
		{
			//posso inserire la carta facendo l'update del campo copies
			var result = await cards.newCopy(toInsert.name, deck, username)
			console.log("new copy of " + toInsert.name + " insert into " + deck)
			return true
		}
	}
	else
	{
		//nel mazzo non è presente alcuna copia della carta, possiamo inserirla
		var result = await cards.newCard(toInsert, deck, username)
		console.log("new card " + toInsert.name + " insert into " + deck)
		return true
	} 
}

/*
######################################################
*/

//esegue una get all'endpoint card Info di YGO PRODECK e ritorna l'immagine
async function findCardByName(req, res)
{
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	//il .get ritorna una promessa
	console.log(req.param("cardName"))
	var question = "?name=" + req.param("cardName")
	console.log(question)
	axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php' + question).then(function(response)
	{
		var response = response.data.data[0]
		console.log(response)
		res.status(200).send(response)
	}).catch(function(error)
	{
		console.log(error)
		res.status(401).send(error)
	})
}

function dashboardPage(req, res)
{
	res.render('/dashboard', {})
}

module.exports=
{
	newDeck:newDeck,
	alreadyHave:alreadyHave,
	findCardByName:findCardByName,
	showDeck: showDeck,
	modifyDeck:modifyDeck
}