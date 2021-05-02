var db = require('./db.js')

/*
ritorna il numero di partite che l'utente passato 
ha giocato con il deck passato
*/

async function getMatches()
{
	var q = 'select * from battles'
	var matches = await db.query(q, [])
	return matches
}

//ritorna tutti i match in cui l'utente passato ha utilizzato il mazzo passato
async function getByDeckUsed(deck, user)
{
	var q = "select * from battles where (deckHost = ? or deckGuest = ?) and (host = ? or guest = ?) and inCourse = 0"
	var rows = await db.query(q, [deck, deck, user, user])
	if(rows)
		return rows.length
	else
		return 0
}

//ritorna tutte le vittorie dell'utente passato con il deck passato
async function getWinWithDeck(deck, user)
{
	var q = "select * from battles where winner = ? and (deckHost = ? or deckGuest = ?)"
	var rows = await db.query(q, [user, deck, deck])
	if(rows)
		return rows.length
}

//ritorna tutte le sconfitte dell'utente passaco con il deck passato
async function getLoseWithDeck(deck, user)
{
	var q = "select * from battles where loser = ? and (deckHost = ? or deckGuest = ?)"
	var rows = await db.query(q, [user, deck, deck])
	if(rows)
		return rows.length
}

//ritorna tutte le vittorie di un utente
async function getWin(user)
{
	var q = "select * from battles where winner = ?"
	var rows = await db.query(q, [user])
	if(rows)
		return rows.length
}

//ritorna tutte le sconfitte di un utente
async function getLose(user)
{
	var q = "select * from battles where loser = ?"
	var rows = await db.query(q, [user])
	if(rows)
		return rows.length
}

//ritorna il match con id passato
async function getById(id)
{
	var q = "select * from battles where id = ?"
	var rows = await db.query(q, [id])
	return rows[0]
}

//ritorna tutte le partite relative ad un utente
async function getUserMatches(username)
{
    var q = "select * from battles where host = ? or guest = ?"
    var matches = await db.query(q, [username, username])
    return matches
}

//seleziono le ultime 5 partite giocate dall'utente
async function getEndedGames(user)
{
	var q = "select * from battles where (host = ? or guest = ?) and inCourse = 0 order by id desc limit 5"
	var rows = await db.query(q, [user, user])
	return rows
}

//crea una nuova partita
async function newBattle(host)
{
	var q = "insert into battles (host) values(?)"
	var result = await db.query(q, [host])
	return result
}

//permette al guest di entrare nella partita passata
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
	close,
	setWinner ,
	getEndedGames,
	setDeck,
	getWin,
	getLose,
	getWinWithDeck,
	getLoseWithDeck,
	getByDeckUsed,
	getUserMatches,
    getMatches
}
