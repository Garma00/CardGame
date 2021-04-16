## Endpoints

* /user
* /submit
* /deck
* /battle

### User
get /user passando come parametro "username" ritorna un json con
i dati relativi all'utente.
```
/user?username=jack
```
```json
{
    username: "jack",
    win: 4,
    lose: 5,
    winrate: 44%,
    games: [...],
    used: [...],
    decks: [...]
}
```
### Submit
post /submit crea un nuovo account passando come parametro username
e password.





### Deck
get /deck ritorna il mazzo di un utente passando come parametro 
deck e username.

```json
{
    cards: [..]
}
```
cards è un array che contiene la lista delle carte presenti nel mazzo,
se la risorsa richiesta non esiste viene ritornato un ogetto vuoto.

post /deck permette di creare un nuovo deck a meno che il token non sia 
scaduto o il nome del deck inserito non sia già presente nella lista del 
giocatore. Nel caso di successo o di fallimento la risposta sarà una stringa

put /deck permette di aggiornare il proprio mazzo eliminando o aggiungendo carte 
tramite ajax, l'utente deve possedere il token per effettuare questa operazione.

delete /deck permette di eliminare il mazzo se l'utente possiede il token.

### Battle
get /battle passando come parametro l'id di una battle ritorna una risposta
json con i dati relativi ad essa.
```json
{
    id	12
    host	"carmelo"
    guest	"jack"
    deckHost	null
    deckGuest	null
    lpHost	0
    lpGuest	8000
    inCourse	0
    winner	"jack"
    loser	"carmelo"
    closeHost	1
    closeGuest	1
}
```

post /battle se si possiede il jwt crea una nuova battle inserendo automaticamente
come host l'utente che la chiama.

put /battle permette di eseguire un aggiornamento della battle tra cui:
* Aumento punti vita
* Diminuzione punti vita
* Divisione punti vita
* Cambio mazzo

delete /battle chiude il match per l'utente che la chiama, una volta che entrambi
hanno deciso di chiudere il match la partita si conclude impostando come vincitore 
il giocatore con più punti vita.
