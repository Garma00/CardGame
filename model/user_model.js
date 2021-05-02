var db = require('./db.js')

//ritorna l'user  passato
async function getByUsername(username)
{
	var q = "select * from users where username = ?"
	var rows = await db.query(q, [username])
	return rows
}

//inserisce un nuovo user
async function insert(username, password)
{
	var q = "insert into users (username, password) values (?, ?)"
	var result = await db.query(q, [username, password])
	return result
}

module.exports=
{
	getByUsername:getByUsername,
	insert:insert
}
