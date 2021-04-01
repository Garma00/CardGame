var db = require('./db.js')

async function getByUsername(username)
{
	var q = "select * from users where username = ?"
	var rows = await db.query(q, [username])
	return rows
}

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