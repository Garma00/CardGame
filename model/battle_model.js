var db = require('./db.js')

/*
ritorna il numero di partite che l'utente passato 
ha giocato con il deck passato
*/
async function getByDeckUsed(deck, user)
{
	var q = "select * from battles where (deckHost = ? or deckGuest = ?) and (host = ? or guest = ?) and inCourse = 0"
	var rows = await db.query(q, [deck, deck, user, user])
	if(rows)
		return rows.length
	else
		return 0
}

async function getWinWithDeck(deck, user)
{
	var q = "select * from battles where winner = ? and (deckHost = ? or deckGuest = ?)"
	var rows = await db.query(q, [user, deck, deck])
	if(rows)
		return rows.length
}

async function getLoseWithDeck(deck, user)
{
	var q = "select * from battles where loser = ? and (deckHost = ? or deckGuest = ?)"
	var rows = await db.query(q, [user, deck, deck])
	if(rows)
		return rows.length
}

async function getWin(user)
{
	var q = "select * from battles where winner = ?"
	var rows = await db.query(q, [user])
	if(rows)
		return rows.length
}

async function getLose(user)
{
	var q = "select * from battles where loser = ?"
	var rows = await db.query(q, [user])
	if(rows)
		return rows.length
}

async function getById(id)
{
	var q = "select * from battles where id = ?"
	var rows = await db.query(q, [id])
	return rows
}

//seleziono le ultime 5 partite giocate dall'utente
async function getEndedGames(user)
{
	var q = "select * from battles where (host = ? or guest = ?) and inCourse = 0 order by id desc limit 5"
	var rows = await db.query(q, [user, user])
	return rows
}

async function newBattle(host)
{
	var q = "insert into battles (host) values(?)"
	var result = await db.query(q, [host])
	return result
}

async function joinGuest(guest, id)
{
	var q = "update battles set guest = ? where id = ?"
	var result = await db.query(q, [guest, id])
	return result
}

//aumenta gli lp della quantità passata
async function heal(amount, id, lp)
{
	var q = "update battles set " + lp + " = " + lp  + " + ? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

//diminuisce gli lp della quantità passata
async function hit(amount, id, lp)
{
	var q = "update battles set " + lp + " = " + lp + " -? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

//divide gli lp della quantità passata
async function divide(amount, id, lp)
{
	var q = "update battles set " + lp + " = " + lp + "/? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

//chiude il match per l'host
async function closeHost(id)
{
	var q = "update battles set closeHost = 1 where id = ?"
	var result = await db.query(q, [id])
	return result
}

//chiude il match per il guest
async function closeGuest(id)
{
	var q = "update battles set closeGuest = 1 where id = ?"
	var result = await db.query(q, [id])
	return result
}

//chiude definitivamente la partita
async function close(id)
{
	var q = "update battles set inCourse = 0 where id = ?"
	var result = await db.query(q, [id])
	return result
}

async function setWinner(id, winner, loser)
{
	var q = "update battles set winner = ?, loser = ? where id = ?"
	var result = await db.query(q, [winner, loser, id])
	return result
}

//imposta il matzzo del guest o dell'host nella partita specificata
async function setDeck(id, deck, toUpdate)
{
	var q = "update battles set " + toUpdate +" = ? where id = ?"
	var result = await db.query(q, [deck, id])
	return result
}

module.exports=
{
	newBattle,
	getById,
	joinGuest,
	heal,
	hit,
	divide,
	closeHost,
	closeGuest,
	close,
	setWinner ,
	getEndedGames,
	setDeck,
	getWin,
	getLose,
	getWinWithDeck,
	getLoseWithDeck,
	getByDeckUsed
}