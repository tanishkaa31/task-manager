const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const token = jwt.sign({_id: 'abch12'} , 'thisismysecret', {expiresIn: '1 second'})   //first argument: this is an object containing the data embedded in the token;  For authentication tokens, the object must contain a unique identifier for the token (here, id for the user will work)  
    // second argument: secret: random characters   //third argument: optional; options object => contains when the token will expire
   // console.log(token)      //format: 'header.payload.signature'    //payload/body = contains the data we provided, here: the id    //signature: used for verification of token
    //header contains info about the type of token it is (here: jwt) and the algorithm used to generate it
    const data = jwt.verify(token, 'thisismysecret')
    //the point of jwt is not to hide the data, since the payload can be decoded and is visible to everyone; the point is to verify
    //the data (payload) with the signature; so anyone who doesn't have the signature (or the secret) won't be able to chnange the data
    console.log(data)       //returns base-64 decoded payload if verification works, else error [base64decode.org]
}

myFunction()