var express = require('express')
var users = require('../model/user_model')
var deck = require('../model/deck_model.js')
var bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var util = require('../utility.js')

/*
1. controlli sui parametri passati in modo che non siano vuoti
2.controllo sull'username in modo che sia univoco
3.ritorno alla pagina(se non passano i due controlli ritorno
alla pagina di registrazione con un messaggio di errore, 
altrimenti ritorno al profilo dell'utente)
*/
async function newAccount(req, res)
{
	var username = req.body.username
	var password = req.body.password
	console.log(username, password)
	if(username == null || password == null)
	{
		//l'utente ha lasciato almeno un campo vuoto 
		//redirect a submit.ejs
		res.status(400).send("invalid username or password")
	}
	else
	{
		var rows = await users.getByUsername(username)
		if(rows)
		{
			//username già preso
			//redirect a submit.ejs
			res.status(410).send("Username already taken")
		}
		else
		{
			//username disponibile, inserisco l'utente nel db
			var hash = await hashPassword(password)
			
			if(hash == null)
				res.send("cannot hash password")
			else
			{
				var result = await users.insert(username, hash)
				if(result)
					res.render("login.ejs", {})
					//redirect a login.ejs
			}
		}
	}
}

async function hashPassword(password)
{
	const salt = 10;
	var p = new Promise(function(resolve, reject)
	{
		bcrypt.hash(password, salt, function(err, hash)
		{
			if(err)
				return reject(err)
			else
			{
				password = hash;
				console.log("hashPassword --> " + password)
				return resolve(password)
			}
		})
	})
	try
	{
		var pw = await p
		console.log("promessa mantenuta")
		return pw
	}
	catch(err)
	{
		console.log("promessa non mantenuta --> " + err)
	}
}

/*
1.controllo che i due campi del form non siano vuoti
2.controllo che username e password siano corretti
3.se va tutto bene ritorno il token*/
async function startSession(req, res)
{
	var username = req.body.username
	var password = req.body.password
	console.log("Post request to login")
	console.log(username + " " + password)
	if(username == null || password == null)
		res.status(400).send("invalid username or password")
	else
	{
		var rows = await users.getByUsername(username)
		//console.log(rows[0].password)
		if(rows)
		{
			var result = await comparePw(password, rows[0].password)
			if(result)
			{
				//genero un JWT
				util.generateToken(res, username)
				//obj = {username: username}
				res.redirect('/dashboard')
			}
			else
				res.status(401).send("invalid account")
		}
		else
			res.status(401).send("invalid account")
	}
}

async function comparePw(password, hash)
{
	var p = new Promise(function(resolve, reject)
	{
		bcrypt.compare(password, hash, function(err, result)
		{
			console.log("result --> " + result)
			if(err)
				console.log("impossibile il controllo tra password --> " + err)
			if(result)
				resolve(result)
			else
				reject(result)
		})
	})
	try
	{
		var result =  await p
		console.log("promessa di login mantenuta")
		return true
	}
	catch(err)
	{
		console.log("promessa di login non mantenuta --> " + err)
		return false
	}
}

function submitPage(req, res)
{
	//ritorno la pagina di submnit
	console.log("get request to submit")
	res.render('submit.ejs', {})
}

function home(req, res)
{
	console.log("get request to /")
	res.render("login.ejs", {})
}

async function dashboardPage(req, res)
{
	var token = await util.verifyToken(req, res)
	console.log("get request to /dashboard from user --> " + req.user.username)
	var decks = await getMyDecks(req)
	var obj = 
	{
		username: req.user.username,
		decks: decks
	}
	if(token)
		res.render("dashboard.ejs", obj)
	else
		res.status(401).send("Sessione scaduta")
}

async function getMyDecks(req)
{
	var owner = req.user.username
	var decks = await deck.getOwnersDeck(owner)
	return decks
}

module.exports=
{
	startSession: startSession,
	newAccount: newAccount,
	submitPage: submitPage,
	home: home,
	dashboardPage: dashboardPage
	
}