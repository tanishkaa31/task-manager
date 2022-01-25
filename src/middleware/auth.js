const User = require('../models/users')
const jwt = require('jsonwebtoken')

const auth = async (req,res, next) => {
   try{
    const token = req.header('Authorization').replace('Bearer ', '')    
    const isValid = jwt.verify(token, 'this is the user auth secret')       //returns decoded payload if token is valid, else error
    const user = await User.findOne({_id: isValid._id, 'tokens.token': token})      //have to check whether token still present within the user's data since when the user logs out, token is deleted

    if(!user)
    {
        throw new Error()
    }
    
    req.token = token
    req.user = user
    next()
    }catch(e){
       res.status(401).send('You need to be authorized to access this route.')
   }
}

module.exports = auth

// app.use((req, res, next) => {
//     console.log(req.method, req.path)
//     // if(req.method == 'GET'){
//     //     return res.send('cannot find GET request')
//     // }
//     // next()
//     res.status(503).send('Site under maintenance')
// })
