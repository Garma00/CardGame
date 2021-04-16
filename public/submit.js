window.onload = function()
{
    var username = document.getElementById("username")
    var password = document.getElementById("password")
    var submit = document.getElementById("submit")
    console.log(username)
    console.log(password)
    console.log(submit)
    
    submit.addEventListener("click", function(){tryToSubmit(username, password)})
}

function tryToSubmit(username, password)
{
    console.log(username.value)
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
