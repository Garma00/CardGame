window.onload = function()
{
	var find = document.getElementById("find")
	var del = document.getElementById("delete")
	find.addEventListener("click", search)
	del.addEventListener("click", deleteDeck)

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
			img.setAttribute('src', result.card_images[0].image_url);
			img.setAttribute('class', 'mark');


			if(preview.hasChildNodes())
				preview.removeChild(preview.childNodes[0])
			preview.appendChild(img)
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
		error: function error(){console.log("insert card error")}
	})

}