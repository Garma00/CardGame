window.onload = function()
{
	var buttons = document.getElementsByClassName("waves-effect waves-light deep-orange lighten-1 btn")
	for(i = 0; i < buttons.length; i++)
		buttons[i].addEventListener("click", decks)
}

function decks()
{
	var param = "?deckName=" + this.innerHTML
	window.open('/deck'+param, "_self")
}

