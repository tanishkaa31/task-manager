const express = require('express')
const User = require('../models/users.js')
const auth = require('../middleware/auth.js')

const router = new express.Router()

//signup and login are the only 2 routes that will NOT require authentication to work! they are the steps where the token is provided.
//signup
router.post('/users', async (req, res) => {
    const user = new User( req.body )
    
    try{
        //await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }
    catch(e){
        res.status(400).send(e)
    }
    

    // user.save().then(() => res.status(201).send(user))
    //     .catch((e) => res.status(400).send(e))
})

//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(error) {
        res.status(400).send(error.message)
    }
})

//logout
router.post('/users/logout', auth, async (req, res) => {
    try{
       req.user.tokens = req.user.tokens.filter((token) => {
           return token.token != req.token              //contains all the tokens except the current token
       })

       await req.user.save()
       res.send('Successfully logged out!')
    }catch(e){
        res.status(500).send(e)
    }
})

//logout of all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('Successfully logged out of all devices')
    }catch(e){
        res.status(500).send(e)
    }
})

//read user profile data
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
    // try{
    //     const users = await User.find({})
    //     res.send(users)
    // }catch(e){res.status(500).send(e)}
    //.then((users) =>  res.send(users))     //send all users
    //     .catch((e) => res.status(500).send(e))
})

router.patch('/users/me',auth, async (req, res) => {
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)  //if even one false returned, every returns false; otherwise: true
    })
    if(!isValidOperation){
        return res.status(400).send("Invalid update.")
    }       //if this code is not included, then invalid update would have resulted in res.send(user), with no change in user and status code 200!
    try{
        //const user = await User.findById(req.user._id) 
        updates.forEach((update) => req.user[update] = req.body[update])    //bracket notation since update = string 
        await req.user.save()
        res.send(req.user)

      //findbyIdandUpdate bypasses middleware, therefore, this line is replaced by 3 lines of code above  
      // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})  //new returns updated user 
    //    if(!user){
    //        return res.status(404).send("User not found.")
    //    }
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {

     try{
    //     const user = await User.findByIdAndDelete(req.user._id)
    //     if(!user)
    //     { return res.status(404).send("User not found.")}

    await req.user.remove()
    res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id       //mongoose automatically converts id to objectID
//     try{
//        const user = await User.findById(_id)
//        if(!user)
//             return res.status(404).send('User not found.')
//        res.send(user)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
//     // User.findById(_id).then((user) => {
//     //     if(!user)   //user not found
//     //         return res.status(404).send("User not found.")
//     //     res.send(user)
//     // }).catch((e) => res.status(500).send(e))
// })