var db = require('./db.js')

//ritorna il numero di carte presenti nel deck
async function getDeckLength(deck, user)
{
	var q = "select copies from cards where deck = ? and user = ?"
	var rows = await db.query(q, [deck, user])
	var size = 0
	if(rows)
		for(i = 0; i < rows.length; i++)
			size += rows[i].copies
	return size
}

//ritorna la carta richiesta dal deck richiesto
async function getCardFromDeck(card, deck, user)
{
	var q = "select * from cards where name = ? and deck = ? and user = ?"
	var rows = await db.query(q, [card, deck, user])
	return rows
}

//ritorna tutte le carte relative al deck passato come parametro
async function getFromDeck(deck, user)
{
	var q = "select * from cards where deck = ? and user = ? order by name"
	var rows = await db.query(q, [deck, user])
	return rows
}

//ritorna il numero di copie di una carta nel mazzo
async function getCopiesNumber(card, deck, user)
{
	var q = "select copies from cards where name=? and deck=? and user=?"
	var result = await db.query(q, [card, deck, user])
	return result[0].copies
}

//ritorna tutte le carte appartenenti al deck del tipo specificato
async function getSizeByType(deck, user, type)
{
	var q = "select * from cards  where deck=? and user=? and type=?"
	var rows = await db.query(q, [deck, user, type])
	var size = 0
	if(rows)
		for(var i = 0; i < rows.length; i ++)
			size +=rows[i].copies
    
	return size
}

//se nel mazzo ha già delle copie della stessa carta allora
//eseguo l'update del campo copie
async function newCopy(card, deck, user)
{
	var q = "update cards set copies=copies+1 where name=? and deck=? and user=?"
	var result = await db.query(q, [card, deck, user])
	return result
}

//se l'utente non ha alcuna copia della carta la inserisco
async function newCard(card, deck, user)
{
	var q = "insert into cards (name, id, img, atk, def, effect, deck, user, type, attribute, race, level, copies) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)"
	var result = await db.query(q, [card.name, card.id, card.card_images[0].image_url, card.atk, card.def, card.desc, deck, user, card.type, card.attribute, card.race, card.level])
}

//decremento copies della carta specificata
async function removeCopy(card, deck, user)
{
	var q = "update cards set copies = copies-1 where name = ? and deck = ? and user = ?"
	var result = await db.query(q, [card, deck, user])
	return result
}

//rimuovo la entry della carta specificata
async function removeCard(card, deck, user)
{
	var q = "delete from cards where name = ? and deck = ? and user = ?"
	var result = await db.query(q, [card, deck, user])
	return result
}

//elimino tutte le carte relative al deck
async function deleteDeck(deck, user)
{
	var q = "delete from cards where deck = ? and user = ?"
	var result = await db.query(q, [deck, user])
	return result
}
module.exports=
{
	getFromDeck,
	getCardFromDeck,
	getCopiesNumber,
	newCopy,
	newCard,
	getDeckLength,
	getSizeByType,
	removeCopy,
	removeCard,
	deleteDeck
}
