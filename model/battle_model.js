var db = require('./db.js')

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
	var q = "update battles set guest = ?, activeUsers = 2 where id = ?"
	var result = await db.query(q, [guest, id])
	return result
}

async function healHost(amount, id)
{
	var q = "update battles set lpHost = lpHost + ? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

async function hitHost(amount, id)
{
	var q = "update battles set lpHost = lpHost - ? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

async function divideHost(amount, id)
{
	var q = "update battles set lpHost = lpHost / ? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

async function healGuest(amount, id)
{
	var q = "update battles set lpGuest = lpGuest + ? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

async function hitGuest(amount, id)
{
	var q = "update battles set lpGuest = lpGuest - ? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

async function divideGuest(amount, id)
{
	var q = "update battles set lpGuest = lpGuest / ? where id = ?"
	var result = await db.query(q, [amount, id])
	return result
}

async function closeHost(id)
{
	var q = "update battles set closeHost = 1 where id = ?"
	var result = await db.query(q, [id])
	return result
}

async function closeGuest(id)
{
	var q = "update battles set closeGuest = 1 where id = ?"
	var result = await db.query(q, [id])
	return result
}

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

async function setDeckH(id, deck)
{
	var q = "update battles set deckHost = ? where id = ?"
	var result = await db.query(q, [deck, id])
	return result
}

async function setDeckG(id, deck)
{
	var q = "update battles set deckGuest = ? where id = ?"
	var result = await db.query(q, [deck, id])
	return result
}

module.exports=
{
	newBattle: newBattle,
	getById: getById,
	joinGuest: joinGuest,
	healHost: healHost,
	hitHost: hitHost,
	divideHost: divideHost,
	healGuest: healGuest,
	hitGuest: hitGuest,
	divideGuest: divideGuest,
	closeHost: closeHost,
	closeGuest: closeGuest,
	close: close,
	setWinner: setWinner ,
	getEndedGames: getEndedGames,
	setDeckH: setDeckH,
	setDeckG: setDeckG,
	getWin: getWin,
	getLose: getLose,
	getWinWithDeck: getWinWithDeck,
	getLoseWithDeck: getLoseWithDeck,
	getByDeckUsed: getByDeckUsed

}