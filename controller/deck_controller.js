var express = require('express')
const axios = require('axios').default;
var util = require('../utility.js')
var deck = require('../model/deck_model.js')
var cards = require('../model/cards_model.js')
var battle = require('../model/battle_model.js')

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
	//con delle query ottengo delle informazioni da mostrare del model
	var rows = await cards.getFromDeck(deckName, username)
	var size = await cards.getDeckLength(deckName, username)

		spells = await cards.getSizeByType(deckName, username, "spell card"),
		traps = await cards.getSizeByType(deckName, username, "Trap Card"),
		normalMonsters = await cards.getSizeByType(deckName, username, "normal monster"),
		effectMonsters = await cards.getSizeByType(deckName, username, "effect monster"),
		synchroMonsters =  await cards.getSizeByType(deckName, username, "synchro monster"),
		tunerMonsters = await cards.getSizeByType(deckName, username, "tuner monster"),
		totalCards =  normalMonsters + effectMonsters + synchroMonsters + tunerMonsters + spells + traps
		win =  await battle.getWinWithDeck(deckName, username),
		lose =  await battle.getLoseWithDeck(deckName, username)

	var obj =
	{
		username: req.user.username,
		deck:deckName,
		cards: rows,
		size: size,
		spells: spells,
		traps: traps,
		normalMonsters: normalMonsters,
		effectMonsters: effectMonsters,
		synchroMonsters: synchroMonsters,
		tunerMonsters: tunerMonsters,
		totalCards: totalCards,
		win: win,
		lose: lose

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
		case 1:
			console.log("try to remove card")
			await removeCard(req, res)
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
1. controllo se nel mazzo è presente quella carta
2. se è presente controllo se copies > 1
*/
async function removeCard(req, res)
{
	var toInsert = req.body.card
	var deck = req.body.deck
	var username = req.user.username

	var rows = await cards.getCardFromDeck(toInsert.name, deck, username)
	if(!rows)
	{
		console.log("cant remove this card") 
		return false
	}
		
	var copies = rows[0].copies
	if(copies > 1)
		cards.removeCopy(toInsert.name, deck, username)
	else
		cards.removeCard(toInsert.name, deck, username)
	
	return true
}

/*
1. se l'utente è connesso
2. controllo se l'utente possiede il mazzo che vuole eliminare
*/

async function deleteDeck(req, res)
{	
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	
	var toDelete = req.body.deck
	var username = req.user.username

	//rimuovo le carte dalla lista
	if(deck.getByNameAndOwner(toDelete, username))
	{
		await cards.deleteDeck(toDelete, username)
		await deck.del(toDelete, username)
		res.redirect("/dashboard")
		return true
	}
	else
	{
		console.log(username + " has not " + toDelete + " deck")
		res.redirect("/dashboard")
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
	modifyDeck:modifyDeck,
	deleteDeck:deleteDeck
}