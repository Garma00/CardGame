const express = require('express')
const db = require('mysql')

const c = db.createConnection(
{
	database:'cardgame',
	host:'localhost',
	user:'jack',
	password:'jack'
})

//q è una funzione generica che mi permette di eseguire qualsiasi query in maniera asincrona 
//in questo modo ottimizzo le prestazioni
async function q(q, params)
{
	var debug = 0
	//se la query va a buon fine la promessa viene mantenuta 
	var p = new Promise(function(resolve, reject)
	{
		c.query(q, params, function(err, rows, fields)
		{
			if(err)
			{
				if(debug)
					console.log("Query error --> " + err)
				return reject(err)
			}
			if(rows.length || rows.affectedRows)
			{
				if(debug)
					console.log("Query " + q + " OK!")
				return resolve(rows)
			}
			else
				reject("Empty result")
		})
	})

//ritorno il risultato se la promessa è stata mantenuta
	try
	{
		var result = await p
		return result
	}
	catch(err)
	{	
		if(debug)
			console.log("DB error  or empty result " + err)
		return null
	}
}

module.exports=
{
	connection: c,
	query: q
}
