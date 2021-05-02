window.onload = function()
{
    var username = document.getElementById("username")
    var password = document.getElementById("password")
    var submit = document.getElementById("submit")
    
    submit.addEventListener("click", function(){tryToSubmit(username, password)})
}

/*
	se non è già presente un utente con lo stesso nome ed i campi non sono vuoti
	allora la registrazione andrà a buon fine
*/
function tryToSubmit(username, password)
{
	if(!username.value || !password.value)
	{
		M.toast({html: "riempi tutti i campi"})
		return false
	}
    $.ajax(
        {
            url: '/user',
            method: 'post',
            data:
            {
                username: username.value,
                password: password.value
            },
            //se ha avuto successo la registrazione renderizzo alla pagina di login
            success: function success(result){window.open('/', '_self')},
            error: function error(obj, error, stat)
            {
               window.open('/submit', '_self')
                M.toast({html: error})
            }
        })
}
