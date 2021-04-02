var db = require('./db.js')

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

module.exports=
{
	getByName:getByName,
	insert:insert
}