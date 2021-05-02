var db = require('./db.js')

//ritorna tutti i deck
async function getAll()
{
	var q = 'select * from decks'
	var decks = await(db.query(q, []))
	return decks
}

//ritorna il deck richiesto, ogni deck è identificato univocamente da
//nome del proprietario e nome del deck
async function getByNameAndOwner(name, owner)
{
	var q = "select * from decks where name = ? and owner = ?"
	var rows = await db.query(q, [name, owner])
	return rows
}

//elimina il deck
async function del(name, owner)
{
	var q = "delete from decks where name = ? and owner = ?"
	var result = await db.query(q, [name, owner])
	return result
}

//ritorno il deck con il nome passato come parametro
async function getByName(name)
{
	var q = "select * from decks where name = ?"
	var rows = await db.query(q, [name])
	return rows
}

//ritorna true se il deck è stato inserito con successo
async function insert(name, owner)
{
	var q = "insert into decks (name, owner) values(?, ?)"
	var result = db.query(q, [name, owner])
	return result
}

//ritorno tutti i deck di un utente
async function getOwnersDeck(owner)
{
	var q = "select * from decks where owner = ?"
	var rows = await db.query(q, [owner])
	return rows
}

module.exports={getAll, getByName, insert, getOwnersDeck, del, getByNameAndOwner}
