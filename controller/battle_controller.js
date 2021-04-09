var express = require('express')
var util = require('../utility.js')
var battle = require('../model/battle_model.js')
var deck = require('../model/deck_model.js')
/*
1. controllo se l'utente è loggato 
2. controllo se l'utente è l'host
3. controllo se il guest è == null
4. controllo se il guest è == all'user
*/
async function joinBattle(req, res)
{
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	//query al db per settare alcune info della battaglia
	console.log("trying to join in battle --> " + req.query.id)
	var rows = await battle.getById(req.query.id)
	console.log(rows)

	//se la partita non è più in corso non puoi entrare
	if(rows[0].inCourse == 0)
	{
		res.status(401).send("partita non più in corso")
		return false
	}
	if(rows[0].host == req.user.username)
		var decksHost = await deck.getOwnersDeck(req.user.username)
	else if(rows[0].guest == req.user.username)
		var decksGuest = await deck.getOwnersDeck(req.user.username)

	console.log("host decks:")
	console.log(decksHost)
	console.log("guest decks")
	console.log(decksGuest)

	// posso entrare solamente se sono l'host o sono il guest
	if(rows[0].host == req.user.username || rows[0].guest == req.user.username)
	{
		var obj = 
		{
			id: rows[0].id,
			host: rows[0].host,
			guest: rows[0].guest,
			deckHost: rows[0].deckHost,
			deckGuest: rows[0].deckGuest,
			lph: rows[0].lpHost,
			lpg: rows[0].lpGuest,
			decksHost: decksHost,
			decksGuest: decksGuest
		}
		res.render("battle.ejs", obj)		
		return true
	}
	//se il guest è null posso comunque entrare ma prima devo settarlo ad user
	if(rows[0].guest == "waiting")
	{
		console.log(req.user.username + " joining in battle " + req.query.id)
		var result = await battle.joinGuest(req.user.username, req.query.id)
		var obj = 
		{
			id: rows[0].id,
			host: rows[0].host,
			guest: rows[0].guest,
			deckHost: rows[0].deckHost,
			deckGuest: rows[0].deckGuest,
			lph: rows[0].lpHost,
			lpg: rows[0].lpGuest,
			decksHost: decksHost,
			decksGuest: decksGuest
		}
		res.render("battle.ejs", obj)		
		return true
	}
	return false
}

/*
1.controllo se l'utente è loggato
2.creo la battaglia
*/
async function createBattle(req, res)
{
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	//l'host entra in partita senza obbligo di selezionare il mazzo
	var result = await battle.newBattle(req.user.username)
	if(result)
		res.redirect('/battle?id=' + result.insertId)
	else
		return false
	console.log("joining in battle --> " + result.insertId)
	return true

}
/*
1. controllo se l'utente è loggato
2. controllo se l'utente è l'host o il guest
3. aggiorno gli lp dell'utente

*/
async function updateBattle(req, res)
{
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	console.log("battle id --> " + req.body.id)
	var rows = await battle.getById(req.body.id)
	if(req.user.username == rows[0].host)
		var toUpdate = "host"
	else if(req.user.username == rows[0].guest)
		var toUpdate = "guest"
	else
	{
		res.status(401).send("error")
		return false
	}

	var type =parseInt(req.body.type)
	var amount = parseInt(req.body.amount)
	var id = req.body.id

	switch(type)
	{
		case 0:
			if(toUpdate == "host")
				var result = await battle.healHost(amount, id)
			else if(toUpdate == "guest")
				var result = await battle.healGuest(amount, id)			
			return true
			break;

		case 1:
			if(toUpdate == "host")
				await battle.hitHost(amount, id)
			else if(toUpdate == "guest")
				await battle.hitGuest(amount, id)
			return true
			break;

		case 2:
			if(toUpdate == "host")
				await battle.divideHost(amount, id)
			else if(toUpdate == "guest")
				await battle.divideGuest(amount, id)
			return true
			break;
		//aggiorno la battaglia
		case 3:
			if(toUpdate == "host")
				await battle.setDeckH(id, req.body.deck)
			else if(toUpdate == "guest")
				await battle.setDeckG(id, req.body.deck)
			return true
			break;

		default:
			return false;
			break;
	}
	return true
}
/*
1. controllo se l'utente è loggato
2. controllo se il player è loggato
*/
async function endBattle(req, res)
{
	var token = await util.verifyToken(req, res)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	console.log(req.body)
	var match = await battle.getById(req.body.id)
	var player = isInGame(match[0], req.user.username)
	
	if(!player)
		return false

	if(player == "host")
		await battle.closeHost(req.body.id)
	if(player == "guest")
		await battle.closeGuest(req.body.id)

	//aggiorno per vedere se entrambi vogliono chiudere il match
	var match = await battle.getById(req.body.id)

	if(match[0].closeHost == 1 && match[0].closeGuest == 1)
	{
		setWinner(match[0])
		await battle.close(req.body.id)
	}

}

//retorna host o guest se il player è uno di loro altrimenti ritorna false
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



module.exports=
{
	joinBattle: joinBattle,
	createBattle: createBattle,
	updateBattle: updateBattle,
	endBattle: endBattle
}