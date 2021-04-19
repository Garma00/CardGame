window.onload = function()
{
    console.log("trade.js")
    var owner = document.getElementById('owner')
    var card = document.getElementById('card')
    var find = document.getElementById('find')
    var message = document.getElementById('message')
    var toInsert = document.getElementById('toInsert')
    var toDel = document.getElementById('toDel')
    var insert = document.getElementById('insert')
    var remove = document.getElementById('remove')

    find.addEventListener('click', function(){getTrade(owner.value, card.value)})
    insert.addEventListener('click', function(){createTrade(toInsert.value, message.value)})
    remove.addEventListener('click', function(){deleteTrade(toDel.value)})
}

function createTrade(card, message)
{
    console.log(card)
    console.log(message)
    $.ajax(
        {
            url: '/trade/',
            method: 'post',
            data: 
            {
                card: card,
                message: message
            },
            success: function(result){M.toast({html: 'trade inserito con successo'})},
            error: function(){console.log(M.toast({html: 'impossibile inserire questo trade'}))}
        })
}

function getTrade(owner, card)
{
    $.ajax(
        {
            url: '/trade/',
            method: 'get',
            data:
            {
                owner: owner,
                card: card
            },
            success: function(result){buildTable(result.trades)},

            error: function(){console.log(M.toast({html: 'nessun risultato'}))}
        })
}

function buildTable(trades)
{
    var table = document.getElementById('table');
    var txt = null
    var rows = table.rows.length
    console.log(rows)
    while(rows)
    {
        table.deleteRow(0)
        rows--;
    }
    for(trade in trades)
    {
        var row = table.insertRow()
        var userCell = row.insertCell()
        txt = document.createTextNode(trades[trade].user)
        userCell.appendChild(txt)
        var cardCell = row.insertCell()
        txt = document.createTextNode(trades[trade].card)
        cardCell.appendChild(txt)
        var messageCell = row.insertCell()
        txt = document.createTextNode(trades[trade].message)
        messageCell.appendChild(txt)
        var idCell = row.insertCell()
        txt = document.createTextNode(trades[trade].id)
        idCell.appendChild(txt)
    }
}

function deleteTrade(id)
{
    console.log(id)
    $.ajax(
        {
            url: '/trade/',
            method: 'delete',
            data: {id: id},
            success: function(result){M.toast({html: 'eliminato con successo'})},
            error: function(obj){M.toast({html: 'impossibile eliminare questo trade'})}
        })
}
