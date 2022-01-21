const express = require('express')
const User = require('../models/users.js')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User( req.body )

    try{
        await user.save()
        res.status(201).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
    

    // user.save().then(() => res.status(201).send(user))
    //     .catch((e) => res.status(400).send(e))
})

router.get('/users', async (req, res) => {
    
    try{
        const users = await User.find({})
        res.send(users)
    }
    catch(e){
        res.status(500).send(e)
    }
    

    // .then((users) =>  res.send(users))     //send all users
    //     .catch((e) => res.status(500).send(e))
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id       //mongoose automatically converts id to objectID

    try{
       const user = await User.findById(_id)
       if(!user)
            return res.status(404).send('User not found.')
       res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
    // User.findById(_id).then((user) => {
    //     if(!user)   //user not found
    //         return res.status(404).send("User not found.")
    //     res.send(user)
    // }).catch((e) => res.status(500).send(e))
})

router.patch('/users/:id', async (req, res) => {
    
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)  //if even one false returned, every returns false; otherwise: true
    })

    if(!isValidOperation){
        return res.status(400).send("Invalid update.")
    }       //if this code is not included, then invalid update would have resulted in res.send(user), with no change in user and status code 200!

    try{
       const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})  //new returns updated user 
       if(!user){
           return res.status(404).send("User not found.")
       }

       res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {

    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user)
        {
            return res.status(404).send("User not found.")
        }

        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router