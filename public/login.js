window.onload = function()
{
    var signiIn = document.getElementById("signIn")
    var username = document.getElementById("username")
    var password = document.getElementById("password")
    signIn.addEventListener("click", function(){login(username, password)})
}

//post /login
function login(username, password)
{
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
