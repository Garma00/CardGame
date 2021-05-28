var express = require('express')
const axios = require('axios').default;
var util = require('../utility.js')
var deck = require('../model/deck_model.js')
var cards = require('../model/cards_model.js')
var battle = require('../model/battle_model.js')

//ritorna tutti i deck
async function getDecks(req, res)
{
	util.trackRequest('deck', req)
	var decks = await deck.getAll()
	if(!decks)
	{
		res.status(404).json({message: "nessun mazzo trovato"})
		return false
	}
	res.status(200).json({decks: decks})	
	return true
}

//ritorna tutti i deck dell'utente
async function getUserDecks(req, res)
{
	util.trackRequest('/:username/deck', req)
	var decks = await deck.getAll()
    var decks = await deck.getOwnersDeck(req.params.username)
    if(!decks)
    {
        res.status(404).json({message: "impossibile trovare questo deck"})
        return false
    }
    res.status(200).json({decks: decks})
    return true
}

//ritorna il deck di un utente passati come parametro
async function getDeck(req, res)
{
	util.trackRequest('/:username/deck/:deck', req)
	var response = {cards: await cards.getFromDeck(req.params.deck, req.params.username)} 
	res.status(200).json(response)
}

//crea un nuovo mazzo e lo ritorna con l'utente che ne è proprietario
async function newDeck(req, res)
{
	var response = {cards: await cards.getFromDeck(req.params.deck, req.params.username)} 
	//se l'utente è loggato 
    if(! await util.isLogged(req, res))
        return false
	util.trackRequest('/deck', req)
	var rows = await alreadyHave(req.body.deck, req.user.username)
    //se l'utente ha già un mazzo con questo nome ritorno errore
	if(rows)
	{
		res.status(409).json({message: "nome non disponibile"})
		return false;
	}
    //se il nome è disponibile ritorno il mazzo e l'utente
	if(deck.insert(req.body.deck, req.user.username))
	{
        res.status(200).json({user: req.user.username, deck: req.body.deck})
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
	var response = {cards: await cards.getFromDeck(req.params.deck, req.params.username)} 
    if(!await util.isLogged(req, res))
        return false
	util.trackRequest('/mazzo', req)
	var deckName = req.query.deckName
	var username = req.user.username

	//DA SISTEMARE, PROBABILMENTE NON ENTRA NEL PRIMO IF
	//ottengo i dati relativi al deck da mostrare nella pagina
	var size = await cards.getDeckLength(deckName, username)
	if(req.params.query != null)
	{	//ordine alfabetico
		if(req.params.caso == 0)
			var rows = await cards.getFromDeck(deckName, username)
		else
		{
			res.status(400).send()
			return false
		}
	}
	else
	{
		var rows = await cards.getFromDeck(deckName, username)
	}
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
    if(!await util.isLogged(req, res))
        return false
	util.trackRequest('/deck', req)
	switch(parseInt(req.body.type))
	{
		case 0:
			if(await addCard(req, res))
            {
                res.status(200).send("card inserted")
                return true
            }
			else
            {
                res.status(400).send("cannot insert this card")
                return false
            }
			break;
		case 1:
			if(await removeCard(req, res))
            {
                res.status(200).send("card removed")
                return true
            }
			else
            {
                res.status(400).send("cannot remove this card")
                return false
            }
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

	//controllo se la carta non è stata iserita 3 volte
	var rows = await cards.getCardFromDeck(toInsert.name, deck, username)
	if(rows)
	{
		//controllo il numero di copie della carta presenti nel mazzo
		var copies = await cards.getCopiesNumber(toInsert.name, deck, username)
		if(copies >= 3)
		{
			//numero di copie massimo raggiunto
			return false
		}
		else
		{
			//posso inserire la carta facendo l'update del campo copies
			var result = await cards.newCopy(toInsert.name, deck, username)
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
		return false
	
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
    if(!await util.isLogged(req, res))
        return false
	util.trackRequest('/deck', req)
	var toDelete = req.body.deck
	var username = req.user.username
	
	//se l'utente possiedo il mazzo procedo
	if(deck.getByNameAndOwner(toDelete, username))
	{
		//elimino tutte le carte relative al deck
		await cards.deleteDeck(toDelete, username)
		//elimino il deck
		await deck.del(toDelete, username)
        res.status(200)
        res.json({user: username, deck: toDelete})
		return true
	}
	else
	{
        res.status(404).json({message: "l'utente non possiede questo mazzo"})
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
	util.trackRequest('/search', req)
	//il .get ritorna una promessa
	let question
	if(req.query.IDcard)
		question = '?id=' + req.query.IDcard
	else if(req.query.cardName)
		question = "?name=" + req.query.cardName
	else
		return false

	axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php' + question).then(function(response)
	{
		var response = response.data.data[0]
		res.status(200).send(response)
	}).catch(function(error)
	{
		res.status(401).send(error)
	})
}

module.exports = {getDecks, getUserDecks, getDeck, newDeck, alreadyHave, findCardByName, showDeck, modifyDeck, deleteDeck}
