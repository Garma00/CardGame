var express = require('express')
var util = require('../utility.js')
var battle = require('../model/battle_model.js')
var deck = require('../model/deck_model.js')

//ritorna tutti i match di un utente
async function getUserBattles(req, res)
{
    var matches = await battle.getMatches(req.params.username)
    if(!matches)
    {
        res.status(404).json({message: "nessuna partita trovata"})
        return false
    }
    res.status(200).json({matches: matches})

}

async function getBattle(req, res)
{
    var match = await battle.getById(req.params.id)
    if(!match)
	{
        res.status(404).json({message: "match non trovato"})
        return false
    }
    res.status(200).json({match: match})
    return true
}

//capire perchè non viene eseguita questa funzione
async function join(username, id)
{
    var match = await battleInfo(id, username)
    if((match.host == username || match.guest == username) && match.inCourse == 1)
    {
        console.log("sei host o guest")
        return match
    }
    else if(match.guest == 'waiting')
    {
        console.log("sei guest")
        var result = await battle.joinGuest(username, id)
        var match = await battleInfo(id)
        if(!result)
            return false
        return match
    }
    return false
}

//costruisco un ogetto contenente le informazioni utili per il match
async function battleInfo(idGame, username)
{
    var rows = await battle.getById(idGame)
    if(username == rows.host)
        var decks = await deck.getOwnersDeck(username)
    else if(username == rows.guest)
        var decks = await deck.getOwnersDeck(username)
    console.log(decks)
    var match =
        {
            id: rows.id,
            host: rows.host,
            guest: rows.guest,
            deckHost: rows.deckHost,
            deckGuest: rows.deckGuest,
            lph: rows.lpHost,
            lpg: rows.lpGuest,
            inCourse: rows.inCourse,
            decks: decks
        }
    return match
}

async function createBattle(req, res)
{
    if(!await util.isLogged(req, res))
        return false
	//l'host entra in partita senza dover selezionare il mazzo
	var result = await battle.newBattle(req.user.username)
	if(result)
    {
        var match = await battle.getById(result.insertId)
        res.status(200).json({match: match})
        return true
    }
	else
    {
        res.status(400).json({message: "impossibile creare la partita"})
		return false
    }
}

/*
posso aggiungere togliere o dividere gli lp
posso anche selezionare un mazzo per un utente
*/
async function updateBattle(req, res)
{
    console.log("update battle " + req.body.type)
    if(!await util.isLogged(req, res))
        return false
	console.log(req.body.id)
	var rows = await battle.getById(req.body.id)
    var username = req.user.username

	//mi serve verificare s el'utente è host o guest
	if(username == rows.host)
	{
		var toUpdate = "deckHost"
		var lp = "lpHost"
	}
	else if(username == rows.guest)
	{
		var toUpdate = "deckGuest"
        console.log("username = guest")
		var lp = "lpGuest"
	}

	var type =parseInt(req.body.type)
	var amount = parseInt(req.body.amount)
	var id = req.body.id

	//in base al tipo di richiesta so cosa devo modificare
	switch(type)
	{
		case 0:
			var result = await battle.heal(amount, id, lp)
			if(result)
				return true
			else
				return false
			break;

		case 1:

			var result = await battle.hit(amount, id, lp)
			if(result)
				return true
			else
				return false
			break;

		case 2:

			var result = await battle.divide(amount, id, lp)
			if(result)
				return true
			else
				return false
			break;

		case 3:
			var result = await battle.setDeck(id, req.body.deck, toUpdate)
			if(result)
				return true
			else
				return false
			break;
        case 4:
            console.log("case 4")
            var match = await join(username, id)
            if(match)
            {
                res.status(200).json(match)
                return true
            }
           else
            {
                res.status(400).json({message: 'error!'})
                return false
            }
            break;
//aggiungere case join user
		default:
            console.log("default")
			return false;
			break;
	}
	return true
}

async function renderBattle(req, res)
{
    if(!await util.isLogged(req, res))
        return false
    var match = await battleInfo(req.params.id, req.user.username)
    console.log("match")
    console.log(match)
    if(match)
    {
        res.status(200).render('battle.ejs', match)
        return true
    }
    res.status(400).json({message: "errore impossibile accedere alla partita"})
}
/*
viene chiamata appena viene effetuata una delete di un match
*/
async function endBattle(req, res)
{
    //modificare la chiusra, rendere disponibile solo all'host
    if(!await util.isLogged(req, res))
        return false
	var match = await battle.getById(req.body.id)
	var player = isInGame(match, req.user.username)
    console.log(player)
    /*
        solo l'host può chiudere la partita, in questo modo se chi chiama la delete
        è l'host chiudo la partita e ritorno il match che è stato appena chiuso
    */
	if(player == "host")
    {
        await battle.close(req.body.id)
        res.status(200).json(match)
    }

    else
    {
        res.status(405).json({message: 'non autorizzato'})
        return true
    }
}

//ritorna host o guest se il player è uno di loro altrimenti ritorna false
function isInGame(match, player)
{
	if(match.host == player)
		return "host"
	if(match.guest == player)
		return "guest"
	return false
}

//calcola chi ha più punti vita e setta winner e loser
async function setWinner(match)
{


	var winner = match.host
	var loser = match.guest
	if(match.lpHost < match.lpGuest)
	{
		winner = match.guest
		loser = match.host
	}

	await battle.setWinner(match.id, winner, loser)
}

module.exports={renderBattle, getUserBattles, getBattle, join, createBattle, updateBattle, endBattle}
