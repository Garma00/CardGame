window.onload = function()
{
    var signiIn = document.getElementById("signIn")
    var username = document.getElementById("username")
    var password = document.getElementById("password")
    signIn.addEventListener("click", function(){login(username, password)})
}

/*
	se il login va a buon fine si passa alla dashboard dell'utente
*/
function login(username, password)
{
	if(!username || !password)
	{
		M.toast({html: "riempi tutti i campi"})
		return false
	}
    $.ajax(
        {
            url: 'login',
            method: 'post',
            data:
            {
                username: username.value,
                password: password.value
            },
            success: function success(result){window.open('/dashboard', '_self')},
            error: function error(obj, err, stat){M.toast({html: 'credenziali non valide'})}
        })
}
