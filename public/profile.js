import * as util from './utility.js'

window.onload = function()
{
	var winVsLose =  []
	winVsLose[0] = document.getElementById("win").innerHTML
    winVsLose[1] = document.getElementById("lose").innerHTML

    var username = document.getElementById("username").innerHTML

    var buttons = document.getElementsByClassName("mazzo")
	for(var i = 0; i < buttons.length; i++)
		buttons[i].addEventListener("click", function(){decks(this.textContent, username)})

	/*
    ottengo il nome di ogni mazzo 
    */
	var array1 = document.getElementsByClassName("mazzo")
	var mazzo = []
	for(i = 0; i < array1.length; i++)
		mazzo[i] = array1[i].innerHTML

    /*
    ottengo il numero di volte in cui ogni mazzo è stato usato
    */
	var array2 = document.getElementsByClassName("counter")
	var counter = []
	for(i = 0; i < array2.length; i++)
		counter[i] = array2[i].innerHTML

	/*
    creo il grafico del winrate ed il grafico che rappresenta l'utilizzo
    di ogni mazzo 
    */
	var ctx0 = document.getElementById('winRate')
	var ctx1 = document.getElementById('used')
	var winRate = new Chart(ctx0, util.createChart("doughnut", ['vittorie', 'sconfitte'], winVsLose));
    var mazzi = new Chart(ctx1, util.createChart("bar", mazzo, counter))

}

//mostra le carte del deck con una popup
function decks(name, owner)
{

	var options = {opacity: 0.7}
	var elems = document.querySelectorAll('.modal');
	
	var instances = M.Modal.init(elems, options);

}
