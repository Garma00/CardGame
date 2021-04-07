window.onload = function()
{
	var heal = document.getElementById("heal")
	var hit = document.getElementById("hit")
	var divide = document.getElementById("divide")
	var d6 = document.getElementById("d6")
	var close = document.getElementById("close")

	heal.addEventListener("click", function(){updateLp(0)})
	hit.addEventListener("click", function(){updateLp(1)})
	divide.addEventListener("click", function(){updateLp(2)})
	close.addEventListener("click", closeMatch)
	d6.addEventListener("click", randomNumber)
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
function updateLp(type)
{
	var amount = document.getElementById("amount").value
	var id = document.getElementById("id").innerHTML

	$.ajax(
	{
		url: '/battle',
		method: 'put',
		data:
		{
			amount: amount,
			id: id,
			type: type
		},
		//potrei in caso di successo aggiornare la pagina
		success: function success(result){console.log(result)},
		error: function error(r, e, s){console.log(e + " " + s)
		console.log(r)}
	})
}

function closeMatch()
{
	var id = document.getElementById("id").innerHTML
	console.log(id)
	$.ajax(
	{
		url: '/battle',
		method: 'delete',
		data:
		{
			id: id
		},
		success: function success(result){console.log(result)},
		error: function error(){console.log("cannot delete match")}
	})
}