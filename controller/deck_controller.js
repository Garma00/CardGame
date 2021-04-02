var express = require('express')
var util = require('../utility.js')
var deck = require('../model/deck_model.js')

async function newDeck(req, res)
{
	var deckName = req.body.deck
	//se l'utente è loggato 
	var token = await util.verifyToken(req, res)
	console.log("new deck " + req.user.username)
	if(!token)
	{
		res.status(401).send("invalid account")
		return false;
	}
	//se il nome del deck non è già stato preso
	console.log("deck name --> " + deckName)
	var rows = await deck.getByName(deckName)
	
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

function alreadyExist(name)
{
	console.log("ok")
}

module.exports=
{
	newDeck:newDeck,
	alreadyExist:alreadyExist
}