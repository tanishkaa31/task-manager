const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const myPass = 'hithere'
    const hashedPass = await bcrypt.hash(myPass, 8) //8 = no. of iterations of hashing algorithm
    console.log(myPass, hashedPass)

    //hashing is irreversible, as opposed to encryption, which can be decrypted
    //so, how do we match passwords?
    //by hashing the entered password and comparing it with the hash stored in the database!

    const checkMatch = await bcrypt.compare(myPass, hashedPass)
    console.log(checkMatch)
}

myFunction()