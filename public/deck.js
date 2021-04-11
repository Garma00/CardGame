import * as util from './utility.js'

window.onload = function()
{
	var find = document.getElementById("find")
	var del = document.getElementById("delete")

	var winVsLose = []
	winVsLose[0] = document.getElementById("win").innerHTML
	winVsLose[1] = document.getElementById("lose").innerHTML
	
	var ctx0 = document.getElementById('deckCards')
	var ctx1 = document.getElementById('winRate')
	find.addEventListener("click", search)
	del.addEventListener("click", deleteDeck)

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
	
	var deckCards = new Chart(ctx0, util.createChart("doughnut", labels, cardType))
	var winRate = new Chart(ctx1, util.createChart("doughnut", ['vittorie', 'sconfitte'], winVsLose))

}

function search()
{
	$.ajax(
	{
		url:"/search",
		type:"get",
		data:
		{
			cardName: document.getElementById("cardName").value
		},
		success: function success(result)
		{
			var preview = document.getElementById("preview")
			var img = document.createElement('IMG')
			var buttonsSpan = document.getElementById("buttonsSpan")
			var deck = document.getElementById("deckId").innerHTML
			var insert = document.createElement("BUTTON")
			var remove = document.createElement("BUTTON")
			var atkPreview = document.createElement("H4")
			var t0 = document.createTextNode("ATK " + result.atk)
			
			var defPreview = document.createElement("H4")
			var t1 = document.createTextNode("DEF " + result.def)

			atkPreview.appendChild(t0)
			defPreview.appendChild(t1)

			img.setAttribute('src', result.card_images[0].image_url);
			img.setAttribute('class', 'mark');

			while(preview.lastElementChild)
				preview.removeChild(preview.lastElementChild)
		
			preview.appendChild(img)
			
			if(result.atk >= 0 && result.def >= 0)
			{
				preview.appendChild(atkPreview)
				preview.appendChild(defPreview)	
			}
							
			
			insert.innerHTML = "inserisci"
			insert.className = "flow-text waves-effect waves-light deep-green lighten-1 btn z-depth-4 col s6 offset-s4"
			insert.addEventListener("click", function(){updateDeck(result, deck, 0)})
			

			remove.innerHTML = "rimuovi"
			remove.className = "flow-text waves-effect waves-light deep-orange darken-4 btn z-depth-4 col s6 offset-s4"
			remove.addEventListener("click", function(){updateDeck(result, deck, 1)})
			if(buttonsSpan.hasChildNodes())
			{
				buttonsSpan.removeChild(buttonsSpan.childNodes[1])
				buttonsSpan.removeChild(buttonsSpan.childNodes[0])
			}
			buttonsSpan.appendChild(insert)
			buttonsSpan.appendChild(remove)

		},
		error: function error(obj, status, err){console.log("error" + err)}
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
		success: function success(result){console.log(result)},
		error: function error(){console.log("delete deck error")}
	})
}

/*
0. insert a card
1. delete a card 
*/

function updateDeck(result, deck, type)
{
	console.log("insert --> " + result.name + " into --> " + deck)
	
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
		success: function success(result){console.log(result)},

		//in caso di errore comunicare all'utente perchè non può aggiungere la carta

		error: function error(){console.log("insert card error")}
	})

}