window.onload = function()
{
	var find = document.getElementById("find")
	var del = document.getElementById("delete")
	find.addEventListener("click", search)
	del.addEventListener("click", deleteDeck)

	var normalMonsters = parseInt(document.getElementById("normalMonsters").innerHTML)
	var tuner = parseInt(document.getElementById("tunerMonsters").innerHTML)
	var effect = parseInt(document.getElementById("effectMonsters").innerHTML)

	var win = document.getElementById("win").innerHTML
	var lose = document.getElementById("lose").innerHTML

	var totMonsters = normalMonsters + tuner + effect
	var extra = document.getElementById("extra").innerHTML
	var spells = document.getElementById("spells").innerHTML
	var traps = document.getElementById("traps").innerHTML
	var ctx0 = document.getElementById('deckCards')
	var ctx1 = document.getElementById('winRate')
	var deckCards = new Chart(ctx0, {
    type: 'doughnut',
    data: {
        labels: ['magie', 'mostri', 'trappole', 'extra'],
        datasets: [{
            data: [spells, totMonsters, traps, extra],
            color: '#FFFFFF',
            backgroundColor: [
                'rgba(89, 232, 32, 0.5)',
                'rgba(232, 116, 32, 0.5)',
                'rgba(159, 32, 232, 0.5)',
                'rgba(255, 255, 255, 0.5)'

            ],
            borderColor: [
                '#212121',
                '#212121',
                '#212121',
                '#212121'
            ],
            
            borderWidth: 2
            
        }]

    },
    options: {
    	plugins:
    	{
    		legend:
    		{
    			display:false
    		}
    	},
    	color: '#ffffff',
        scales: {
            y:
            {
                beginAtZero: true,
            	ticks:
	            {
	            	display: false
	            },
	            grid:
            	{
            		display: false
            	},
	        },
            
            x:
            {
            	grid:
            	{
            		display: false
            	},

				ticks:
	            {
	            	display: false
	            }
            }
        }
    },

})

var deckCards = new Chart(ctx1, {
    type: 'doughnut',
    data: {
        labels: ['vittorie', 'sconfitte'],
        datasets: [{
            data: [win, lose],
            color: '#FFFFFF',
            backgroundColor: [
                'rgba(86, 235, 52, 0.5)',
                'rgba(235, 82, 52, 0.5)'

            ],
            borderColor: [
                'rgba(52, 235, 119, 1)',
                'rgba(235, 64, 52, 1)'
            ],
            
            borderWidth: 2
            
        }]

    },
    options: {
    	plugins:
    	{
    		legend:
    		{	
    			display: false
    		}
    	},
    	color: '#ffffff',
        scales: {
        	
            y:
            {
                beginAtZero: true,
            	ticks:
	            {
	            	display: false
	            },
	            grid:
            	{
            		display: false
            	},
	        },
            
            x:
            {
            	grid:
            	{
            		display: false
            	},

				ticks:
	            {
	            	display: false
	            }
            }
            
        }
    }
})

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
		error: function error(){console.log("insert card error")}
	})

}