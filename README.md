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
