## Endpoints

* /user
* /deck
* /battle
* /trade

## /user

### get /:user/battle  
Returns all the matches played by the user passed.  
Parameter(**string** username)  

**example**  
request http://localhost:3000/jack/battle  

* success response(200):  
```json
	{  
		"matches": []  
	}  
```
* failure response(404):  
```json
	{  
		"message": "nessuna partita trovata"  
	}  
```
### get /:user/deck  
Returns all the decks of a user.  
Parameters(**string** username)  

**example**  
request http://localhost:3000/jack/deck

* success response(200):
```json
	{
		"decks":[
			{"name":"deck1", "owner":"jack"},
			{"name":"deck2","owner":"jack"},
			{"name":"deck3","owner":"jack"}]
	}
```

* failure response(404):  
```json
	{
		"message": "impossibile trovare questo deck"
	}
```

### post /user
Create a new account.  
Parameters(**string** username, **string** password)  

**example**  
curl -X POST -d 'username=username' -d 'password=password' http://localhost:3000/user  
 
 * success response(200)  
```json  
	{
		"user":"username"
	}
```
* failure response(400)  
```json  
	{
		"message":"uno o più campi vuoti"
	}
```
* faulure response(410)  
```json
	{
		"message":"username già preso"
	}
```  
### get /user  
Retuns an user.  
**example**   
request curl http://localhost:3000/user/username  
* success response(200)  
```json
	{
		"username":"username",
		"winrate":"NaN%",
		"games":null,
		"used":false,
		"decks":[]}
```  
* failure response(400):  
```json
	{"message": "utente non presente"}
```

## /deck  

### post /deck  
Create a new deck (you need jwt)  
Parameters(**string** deckName)  
**example**  
curl -X POST  http://localhost:3000/deck  
* success response(200)  
```json
	{
		"user": "username",
		"deck": "deckName"
	}
```  
* failure response(409)  
```json
	{"message": "nome non disponibile"}
```  

### put /deck
Update a deck (add/remove cards, you need jwt).
Parameters(**int** type, **object** card, **string** deck).
if type is 0 then the card will be added, else if type is 1 the card  
will be removed.
**example**  
curl -X PUT -d 'type=0' -d 'card=card' -d 'deck=deckName'  http://localhost:3000/deck

* success response(200)
```json
	{"message": "carta inserita/rimossa"}  
``` 
* failure response(400)
```json
	{"message": "impossibile inserire/rimuovere questa carta"}
```

### delete /deck
Delete a deck (you need jwt)  
Parameters(**string** deck).  
**example**  
curl -X DELETE  -d 'deck=deckName' http://localhost:3000/deck  

* success response(200)  
```json
	{
		"user":"username",
		"deck": "deckName"
	}
```
* failure response(400)  
```json
	{"message": "l'utente non possiede questo mazzo"}
```

## /battle  

### get /battle  
Returns all matches.  
**example** http://localhost:3000/battle
* success response(200)  
```json
{
    "matches":[
        {
            "id":1,
            "host":"prova",
            "guest":"jack",
            "deckHost":null,
            "deckGuest":null,
            "lpHost":8000,
            "lpGuest":8000,
            "inCourse":0,
            "winner":"prova",
            "loser":"jack",
            "closeHost":1,
            "closeGuest":1
        },

        {
            "id":2,
            "host":"prova",
            "guest":"jack",
            "deckHost":null,
            "deckGuest":null,
            "lpHost":9000,
            "lpGuest":8000,
            "inCourse":0,
            "winner":"prova",
            "loser":"jack",
            "closeHost":1,
            "closeGuest":1
        },
```
* failure response(404)
```json
	{"message": "nessun match trovato"}
```
if id is passed then you will get only the match identified by it.  

### post /battle  
Create a new battle, then it will be returned (jwt is needed).  
Parameters(**string** username)  
**example**  
curl -X POST -d 'username=jack' http://localhost:3000/battle  
* success response(200)  
```json
	{
		"id":10,
		"host":"jack",
		"guest": "prova"
	}
```  
* failure response(400)  
```json
	{"message": "impossibile creare la partita"}
```

### put /battle  
Provides a few updates for a battle such as:
0. heal lp  
1. hit hp  
2. divide lp  
3. deck in use  
4. join of a guest  
Parameters(**int** id, **int** type, **int**amount), jwt is needed.  
**example**  
curl -X PUT http://localhost:3000/battle  
* success response(200)  
```json
	{
		{"message": "punti vita aggiornati"},	//case 0, 1, 2
		{"message": "mazzo aggiornato"}			//case 3
		{"match":
			{
				"id": 10,
				"host": "jack",
				"guest": "prova",
				
			}}
	}
```  
* failure response(400)  
```json
	{"message": "mazzo non aggiornato"}					//case 0, 1, 2
	{"message": "errore"}								//case 4
	{"message": "tipo di aggiornamento non trovato"}	//default
```  

### delete /battle  
Allow the host to end the battle (jwt is needed).  
Parameters(**int** id)  
**example**  
curl -X DELETE -d 'id=10' 'http://localhost:3000/battle
* success response(200)
```json
	{
		"match": 
		{
			"id":10,
			"host": "jack",
			"guest": "prova"
		}
	}
```
## Trade  

### get /trade  
Returns all trades.  
Parameters(**string** owner, **string** card)
**example**  
http://localhost:3000/trade  
* success response(200)  
```json
	{
		"trade":
		{
			"id": 1,
			"user": "prova",
			"card": "prova",
			"message": "scambio"
		}
		
	}
```  
* failure response(404)  
```json	
	{
		"message": "nessun trade trovato"
	}
```  

### post /trade  
Create a new trade(jwt is needed).  
Parameters(**string** cardName, **string** message)  
**example**  
curl -X POST http://localhost:3000/trade  
* success response(200)  
```json
	{
		"trade":
		{
			"id": 1,
			"user": "prova",
			"card": "tuning",
			"message": "scambio"
		}
	}
```  
* failure response(400)  
```json
	{"message":"errore"}
```

### delete /trade  
Allow the owner to delete the trade.  
Parameters(**int** id)  
**example**  
curl -X DELETE -d'id=1' http://localhost:3000/battle  
* success response(200)  
```json
	{
		"fieldCount": 0,
		"affectedRows": 1,
		"insertId": 0,
		"serverStatus": 34,
		"warningCount": 0,
		"message": "",
		"protocol41": true,
		"changedRows": 0
	}
```  
* failure response(400)  
```json
	{"message": "errore"}
```
