var db = require('./db.js')

async function getByNameAndOwner(name, owner)
{
	var q = "select * from decks where name = ? and owner = ?"
	var rows = await db.query(q, [name, owner])
	return rows
}

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

module.exports=
{
	getByName:getByName,
	insert:insert,
	getOwnersDeck:getOwnersDeck,
	del:del,
	getByNameAndOwner:getByNameAndOwner,
	
}