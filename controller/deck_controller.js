var express = require('express')
const axios = require('axios').default;
var util = require('../utility.js')
var deck = require('../model/deck_model.js')
var cards = require('../model/cards_model.js')
var battle = require('../model/battle_model.js')

//ritorna il deck di un utente passati come parametro
async function getDeck(req, res)
{
	console.log(req.query.deck)
	console.log(req.query.username)
	var response =
	{
		cards: await cards.getFromDeck(req.query.deck, req.query.username)	
	} 
	console.log("response")
	console.log(response)
	res.status(200).json(response)
}

async function newDeck(req, res)
{
	//se l'utente è loggato 
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	
	//se il nome del deck non è già stato preso dallo stesso utente
	console.log("post request to /deck from --> " + req.user.username + " adding --> " + req.body.deck)
	var rows = await alreadyHave(req.body.deck, req.user.username)
	
	if(rows)
	{
		res.status(409).send("Questo nome non è più disponibile")
		return false;
	}
	if(deck.insert(req.body.deck, req.user.username))
	{
		res.redirect('/dashboard')
		return true	
	}
	else
		return false	
}

//ritorna true se l'utente possiede già un mazzo con lo stesso nome
async function alreadyHave(name, user)
{
	var rows = await deck.getByName(name, user)
	if(rows)
		return true
	return false
}

//renderizza alla pagina con le caratteristiche del deck
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
	console.log("get request to /mazzo from --> " + username)

	//ottengo i dati relativi al deck da mostrare nella pagina
	var rows = await cards.getFromDeck(deckName, username)
	var size = await cards.getDeckLength(deckName, username)

	var spells = await cards.getSizeByType(deckName, username, "spell card")
	var traps = await cards.getSizeByType(deckName, username, "Trap Card")
	var normalMonsters = await cards.getSizeByType(deckName, username, "normal monster")
	var effectMonsters = await cards.getSizeByType(deckName, username, "effect monster")
	var synchroMonsters =  await cards.getSizeByType(deckName, username, "synchro monster")
	var xyzMonsters = await cards.getSizeByType(deckName, username, "XYZ Monster")
	var fusionMonsters = await cards.getSizeByType(deckName, username, "Fusion Monster")
	var linkMonsters = await cards.getSizeByType(deckName, username, "Link Monster")
	var extraMonsters = synchroMonsters + xyzMonsters + fusionMonsters + linkMonsters
	var tunerMonsters = await cards.getSizeByType(deckName, username, "tuner monster")
	var win =  await battle.getWinWithDeck(deckName, username)
	var lose =  await battle.getLoseWithDeck(deckName, username)
		
	var obj =
	{
		username: req.user.username,
		deck:deckName,						//nome
		cards: rows,						//lista delle carte
		size: size,							//numero totale delle carte
		spells: spells,						//carte magia
		traps: traps,						//carte trappola
		normalMonsters: normalMonsters,		//mostri senza effetto
		effectMonsters: effectMonsters,		//mostri con effetto
		extraMonsters: extraMonsters,		//mostri dell'extra deck
		tunerMonsters: tunerMonsters,		//mostri tuner
		win: win,							//vittorie
		lose: lose 							//sconfitte
	}
	res.render('deck.ejs', obj)
	return true
}

/*
se l'utente è loggato allore controllo  in base al numero passato:
0. l'utente vuole aggiungere la carta passata
1. l'utente vuole rimuovere la carta passata
*/
async function modifyDeck(req, res)
{
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	
	console.log("put request to deck from --> " + req.user.username)
	switch(parseInt(req.body.type))
	{
		case 0:
			if(await addCard(req, res))
				return true
			else
				return false
			break;
		case 1:
			if(await removeCard(req, res))
				return true
			else
				return false
			break;
	}

	return true
}	

//ritorna true se la carta è stata inserica con successo altrimenti ritorna false
async function addCard(req, res)
{
	var toInsert = req.body.card
	var deck = req.body.deck
	var username = req.user.username

	console.log(toInsert.name + " " + deck + " " + username)

	//controllo se la carta non è stata iserita 3 volte
	var rows = await cards.getCardFromDeck(toInsert.name, deck, username)
	if(rows)
	{
		//controllo il numero di copie della carta presenti nel mazzo
		var copies = await cards.getCopiesNumber(toInsert.name, deck, username)
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


//ritorna true se la carta è stata rimossa con successo, false viceversa
async function removeCard(req, res)
{
	var toDelete = req.body.card
	var deck = req.body.deck
	var username = req.user.username

	//controllo se la carta è presente nel mazzo
	var rows = await cards.getCardFromDeck(toDelete.name, deck, username)
	if(!rows)
	{
		console.log("this card is not in the deck, you cant remove it") 
		return false
	}
	
	//controllo se vi è più di una copia
	var copies = rows[0].copies
	if(copies > 1)
		cards.removeCopy(toDelete.name, deck, username)
	else
		cards.removeCard(toDelete.name, deck, username)
	
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
	
	//se l'utente possiedo il mazzo procedo
	if(deck.getByNameAndOwner(toDelete, username))
	{
		//elimino tutte le carte relative al deck
		await cards.deleteDeck(toDelete, username)
		//elimino il deck
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

//esegue una get all'endpoint card Info di YGO PRODECK e ritorna i dati
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

module.exports = {getDeck, newDeck, alreadyHave, findCardByName, showDeck, modifyDeck, deleteDeck}