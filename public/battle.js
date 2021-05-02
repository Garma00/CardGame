window.onload = function()
{
	var heal = document.getElementById("heal")
	var hit = document.getElementById("hit")
	var divide = document.getElementById("divide")
	var d6 = document.getElementById("d6")
	var close = document.getElementById("close")
	var selectDeck = document.getElementById("selectDeck")
	var decks = document.getElementsByName("deckName")

	/*la updateMatch verrà utilizzata per le varie modifiche ai deck
	ed i punti vita*/
	heal.addEventListener("click", function(){updateMatch(0)})
	hit.addEventListener("click", function(){updateMatch(1)})
	divide.addEventListener("click", function(){updateMatch(2)})
	close.addEventListener("click", closeMatch)
	d6.addEventListener("click", randomNumber)

	for(i = 0; i < decks.length; i++)
		decks[i].addEventListener("click", function(){updateMatch(3, this)})


}

function randomNumber()
{
	var value = Math.floor(Math.random() * 6) + 1;
	document.getElementById("randomN").innerHTML= value
}

/*
0. heal
1. hit
2. divide
*/
function updateMatch(type, deckName)
{
	var amount = document.getElementById("amount").value
	var id = document.getElementById("id").innerHTML
	if(deckName)
		var deck = deckName.innerText
	console.log(deck)
	$.ajax(
	{
		url: '/battle',
		method: 'put',
		data:
		{
			amount: amount,
			id: id,
			deck: deck,
			type: type
		},
		//potrei in caso di successo aggiornare la pagina
		success: function success(result){window.open('/match/'+id, '_self')},
		error: function error(r, e, s){console.log(e + " " + s)
		console.log(r)}
	})
}

function closeMatch()
{
	var id = document.getElementById("id").innerHTML
	if(!id)
	{
		M.toast({html: "inserisci l'id"})
		return false
	}
	$.ajax(
	{
		url: '/battle',
		method: 'delete',
		data:
		{
			id: id
		},
		success: function success(result){window.open('/dashboard', '_self')},
		error: function error()
        {
            M.toast({html: "solo l'host può chiudere la partita"})
        }
	})
}
