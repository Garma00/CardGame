import * as util from './utility.js'

window.onload = function()
{
    /*
    inserisco il numero di vittorie e di sconfitte che mi serviranno per
    il grafico del winrate
    */
    var winVsLose = []
    winVsLose[0] = document.getElementById("win").innerHTML
    winVsLose[1] = document.getElementById("lose").innerHTML

    /*
    ogni bottone rappresenta un mazzo posseduto dall'utente, in questo modo
    do la possibilità di clickare sopra ad ognuno di essi per aprire la pagina
    relativa al mazzo
    */
	var buttons = document.getElementsByClassName("waves-effect mazzo waves-light deep-orange lighten-1 btn")
	for(var i = 0; i < buttons.length; i++)
		buttons[i].addEventListener("click", decks)

    /*
    ottengo il nome di ogni mazzo 
    */
	var array1 = document.getElementsByClassName("mazzo")
	var mazzo = []
	for(i = 0; i < array1.length; i++)
		mazzo[i] = array1[i].innerHTML

    /*
    ottengo il mnumero di volte in cui ogni mazzo è stato usato
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

/*
se viene clickato il bottone che rappresenta 
il mazzo lancio una get con parametro
*/
function decks()
{
	var param = "?deckName=" + this.innerHTML
	window.open('/mazzo'+param, "_self")
}

