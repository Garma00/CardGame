function createChart(type, labels, data)
{
    var obj =
    {
       type: type,
        data:
        {
            labels: labels,
            datasets: [
            {
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options:
        {
            plugins:
            {
                legend:
                {
                    display: false
                }
            },
            scales:
            {
                y:
                {
                    beginAtZero: true
                }
            }
        }
    }

    return obj
}

async function search()
{
    var p = new Promise(function(resolve, reject)
    {
        $.ajax(
        {
            url:"/search",
            type:"get",
            data: {cardName: document.getElementById("cardName").value},
            success: function success(result){
                console.log(result)
                return resolve(result)},
            error: function error(obj, status, err)
            {
                console.log("promessa non mantenuta")
                return reject(err)
            }
        })
    })
    try
    {
        var card = await p
        return card
    }
    catch(err)
    {
        console.log(err)
    }

}

function setSearchingZone(card)
{
    var preview = document.getElementById("preview")
    var img = document.createElement('IMG')
    var buttonsSpan = document.getElementById("buttonsSpan")
    var deck = document.getElementById("deckId").innerHTML
    var insert = document.createElement("BUTTON")
    var remove = document.createElement("BUTTON")
    var atkPreview = document.createElement("H4")
    var t0 = document.createTextNode("ATK " + card.atk)
    var defPreview = document.createElement("H4")
    var t1 = document.createTextNode("DEF " + card.def)

    atkPreview.appendChild(t0)
    defPreview.appendChild(t1)

    img.setAttribute('src', card.card_images[0].image_url);
    img.setAttribute('class', 'mark');

    while(preview.lastElementChild)
        preview.removeChild(preview.lastElementChild)

    preview.appendChild(img)
    
    if(card.atk >= 0 && card.def >= 0)
    {
        preview.appendChild(atkPreview)
        preview.appendChild(defPreview)	
    }
    
    insert.innerHTML = "inserisci"
    insert.className = "flow-text waves-effect waves-light deep-green lighten-1 btn z-depth-4 col s6 offset-s4"

    remove.innerHTML = "rimuovi"
    remove.className = "flow-text waves-effect waves-light deep-orange darken-4 btn z-depth-4 col s6 offset-s4"
    if(buttonsSpan.hasChildNodes())
    {
        buttonsSpan.removeChild(buttonsSpan.childNodes[1])
        buttonsSpan.removeChild(buttonsSpan.childNodes[0])
    }
    buttonsSpan.appendChild(insert)
    buttonsSpan.appendChild(remove)
    return {insert: insert, remove: remove}
}
export {setSearchingZone, createChart, search}
