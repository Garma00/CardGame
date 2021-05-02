import * as util from './utility.js'

window.onload = function()
{
	var find = document.getElementById("find")
	var del = document.getElementById("delete")

	//array contenente il numero di vittorie ed il numero di sconfitte
	var winVsLose = []
	winVsLose[0] = document.getElementById("win").innerHTML
	winVsLose[1] = document.getElementById("lose").innerHTML
	
	//ctx0 ed 1 servono per la creazione dei grafici
	var ctx0 = document.getElementById('deckCards')
	var ctx1 = document.getElementById('winRate')
	find.addEventListener("click", getCard)
	del.addEventListener("click", deleteDeck)

	//ottengo il numero di carte per ogni tipo
	var normalMonsters = parseInt(document.getElementById("normalMonsters").innerHTML)
	var tunerMonsters = parseInt(document.getElementById("tunerMonsters").innerHTML)
	var effectMonsters = parseInt(document.getElementById("effectMonsters").innerHTML)
	
	var cardType = []
	cardType[0] = document.getElementById("extra").innerHTML
	cardType[1] = document.getElementById("spells").innerHTML
	cardType[2] = document.getElementById("traps").innerHTML
	cardType[3] = normalMonsters + tunerMonsters + effectMonsters

	var labels = []
	labels[0] = "extra deck"
	labels[1] = "magie"
	labels[2] = "trappole"
	labels[3] = "mostri"
	
	//creo i due grafici
	var deckCards = new Chart(ctx0, util.createChart("doughnut", labels, cardType))
	var winRate = new Chart(ctx1, util.createChart("doughnut", ['vittorie', 'sconfitte'], winVsLose))
}

//ottengo la carta dal servizio e la mostro insieme ai bottoni per aggiungerla o rimuoverla
async function getCard()
{
    var deck = document.getElementById("deckId")
    var card = await util.search()
	if(!card)
		M.toast({html: "nome errato"})
    var buttons = util.setSearchingZone(card)
    buttons.insert.addEventListener('click', function(){updateDeck(card, deck.innerHTML, 0)})
    buttons.remove.addEventListener('click', function(){updateDeck(card, deck.innerHTML, 1)})
}

/*
0. insert a card
1. delete a card 
*/
function updateDeck(result, deck, type)
{
	$.ajax(
	{
		url:'/deck',
		type:'put',
		data:
		{
			card: result,
			deck: deck,
			type:type
		},
		success: function success(result)
        {
            if(type == 0)
                M.toast({html: 'inserita'})
            else if(type == 1)
                M.toast({html: 'rimossa'})
        },
		//in caso di errore comunicare all'utente perchè non può aggiungere la carta
		error: function error()
        {
            if(type == 0)
                M.toast({html: 'non è possibile inserire questa carta'})
            else if(type == 1)
                M.toast({html: 'non è possibile rimuovere questa carta'})
        }
	})
}

function deleteDeck()
{
	var deck = document.getElementById("deckId").innerHTML
	console.log("delete --> " + deck)
	$.ajax(
	{
		url:'/deck',
		type:'delete',
		data:
		{
			deck: deck,
		},
		success: function success(result)
        {
            window.open("/dashboard", "_self")
        },
		error: function error(){console.log("delete deck error")}
	})
}
