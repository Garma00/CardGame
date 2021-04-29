var express = require('express')
var trade = require('../model/trade_model')
var util = require('../utility.js')

//ritorna tutti i trade
async function getTrades(req, res)
{
    var trades = await trade.getTrades(req.query.owner, req.query.card)
    console.log(req.query.owner)
    console.log(req.query.card)
    if(trades)
    {
        res.status(200).json({trades: trades})
        return true
    }
    else
    {
        res.status(404).json({message: 'nessun trade trovato'})
        return false
    }
}

//aggiunge un nuovo trade e lo ritorna
async function newTrade(req, res)
{
    if(!await util.isLogged(req, res))
        return false
    if(!req.body.card || !req.body.message)
    {
        res.status(400).json({message: 'è richiesta la compilazione di tutti i campi'})
        return false
    }
    var result = await trade.addTrade(req.user.username, req.body.card, req.body.message)
    if(result)
    {
        res.status(200).json({trade: result})
        return true
    }
    res.status(400).json({message: 'errore'})
    return false
}

async function tradePage(req, res)
{
    if(!await util.isLogged(req, res))
        return false
    res.status(200).render('trade.ejs', {username: req.user.username})
    console.log('redirect trade page')
    return true
}

//elimina il trade specificato
async function deleteTrade(req, res)
{
    if(!await util.isLogged(req, res))
        return false
    var toDel = await trade.getById(req.body.id)
    if(toDel && !(toDel.user == req.user.username))
    {
        res.status(401).json({message: 'questo trade non è tuo'})
        return false
    }
    var result = await trade.deleteTrade(req.body.id)
    console.log(result)
    if(result)
        res.status(200).json({deleted: result})
    else
        res.status(400).json({message: 'errore'})
    return result
}

module.exports = {tradePage, getTrades, newTrade, deleteTrade}
