## Endpoints

* /user
* /deck
* /battle
* /trade

## /user

### get /:user/battle  
Return all the matches played by the user passed.  
Parameter(**string** username)  

**example**  
request http://localhost:3000/jack/battle  

* success response(200):  
```json
	{  
		"matches": [...]  
	}  
```
* failure response(404):  
```json
	{  
		"message": "nessuna partita trovata"  
	}  
```
### get /:user/deck  
Return all the decks of a user.  
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
Retun an user.  
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
