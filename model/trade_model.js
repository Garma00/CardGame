var db = require('./db.js')

//ritorna tutti i trade
async function getTrades(user, card)
{
    var  q = 'select * from trade where '
    var trades = null
    if(user && card)
    {
        q = q + 'user = ? and card = ?'
        var trades = await db.query(q, [user, card])
    }
    else if(user)
    {
        q = q + 'user = ?'
        var trades = await db.query(q, [user])
    }
    else if(card)
    {
        q = q + 'card = ?'
        var trades = await db.query(q, [card])
    }
    else
    {
        q = q + '1'
        var trades = await db.query(q, [])
    }
    return trades
}

//ritorna tutti i trade dell'utente
async function getUserTrades(user)
{
    var q = 'select * from trade where user = ?'
    var trades = await db.query(q, [user])
    return trades
}

//ritorna il trade con l'id passato
async function getById(id)
{
    var q = 'select * from trade where id = ?'
    var trade = await db.query(q, [id])
    if(trade)
        return trade[0]
    return null
}

//aggiunge un nuovo trade
async function addTrade(user, card, message)
{
    var q = 'insert into trade (user, card, message) values(?, ?, ?)'
    var result = await db.query(q, [user, card, message])
    return result
}

//rimuove il trade
async function deleteTrade(id)
{
    var q = 'delete from trade where id = ?'
    var result = await db.query(q, [id])
    return result
}

module.exports = {getTrades, getById, getUserTrades, addTrade, deleteTrade}
