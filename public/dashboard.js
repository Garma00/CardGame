window.onload = function()
{
	var buttons = document.getElementsByClassName("waves-effect waves-light deep-orange lighten-1 btn")
	for(i = 0; i < buttons.length; i++)
		buttons[i].addEventListener("click", decks)

	var array1 = document.getElementsByClassName("mazzo")
	var mazzo = []
	for(i = 0; i < array1.length; i++)
		mazzo[i] = array1[i].innerHTML

	var array2 = document.getElementsByClassName("counter")
	var counter = []
	for(i = 0; i < array2.length; i++)
		counter[i] = array2[i].innerHTML

	var ctx0 = document.getElementById('winRate')
	var ctx1 = document.getElementById('used')
	var myChart = new Chart(ctx0, {
    type: 'doughnut',
    data: {
        labels: ['vittorie', 'sconfitte'],
        datasets: [{
            data: [document.getElementById("win").innerHTML, document.getElementById("lose").innerHTML],
            backgroundColor: [
                'rgba(86, 235, 52, 0.5)',
                'rgba(235, 82, 52, 0.5)'
            ],
            borderColor: [
                'rgba(52, 235, 119, 1)',
                'rgba(235, 64, 52, 1)'
            ],
            borderWidth: 3,
            

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
});

	var myChart = new Chart(ctx1, {
    type: 'bar',
    data: {
        labels: mazzo,
        datasets: [{
            data: counter,
            backgroundColor: [
                'rgba(86, 235, 52, 0.5)',
                'rgba(235, 82, 52, 0.5)',
                'rgba(168, 80, 50, 0.5'
            ],
            borderColor: [
                'rgba(52, 235, 119, 1)',
                'rgba(235, 64, 52, 1)',
                'rgba(168, 64, 50, 1'
            ],
            borderWidth: 3,
            

        }]
    },
    options: {
    	plugins:
    	{
    		legend:
    		{
    			display: false
    		},
    		color: '#ffffff'
    	},
        scales: {
            y: {
                beginAtZero: true
            }
        },

    }
})

}

function decks()
{
	var param = "?deckName=" + this.innerHTML
	window.open('/deck'+param, "_self")
}

