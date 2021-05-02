const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

function generateToken(res, username)
{
  const token = jwt.sign({username}, "chiavesegretissima", {
    expiresIn: process.env.DB_ENV === 'testing' ? '1d' : '7d',
  })
  return res.cookie('token', token, {
    expires: new Date(Date.now() + (1000*60*240)),
    secure: false, // set to true if your using https
    httpOnly: true,

  })
}

async function verifyToken(req, res)
{
    const token = req.cookies.token || ''
    if (!token)
        return false
    const decrypt = await jwt.verify(token, "chiavesegretissima")
    if(decrypt)
    {
        req.user = 
        {
            username: decrypt.username
        }
        return true
    }
    return false
}

async function isLogged(req, res)
{
    var token = await verifyToken(req, res)
    if(!token)
        res.status(401).json({message: "sessione scaduta"})
    return token
}


module.exports = {isLogged, generateToken, verifyToken}
