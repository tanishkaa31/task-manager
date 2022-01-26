const express = require('express')
const User = require('../models/users.js')
const auth = require('../middleware/auth.js')
const multer = require('multer')
const sharp = require('sharp')
const { append } = require('express/lib/response')

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

//file upload
const upload = multer({
   // dest: 'avatars',
    limits: {
        fileSize: 1000000 //in bytes; so this is 1MB
    },
    fileFilter(req, file, cb){
        if(file.originalname.match(/\.(png|jpg|jpeg)$/))
            return cb(undefined, true)
        return cb(new Error('File type not supported. (Only png, jpg, jpeg images allowed)'))
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({height:250, width:250}).png().toBuffer()
    req.user.avatar = buffer
    //  req.user.avatar = req.file.buffer           //if dest option is not specified in multer, it sends the uploaded data to req.file in this route handler function 
    await req.user.save()
    res.send('Avatar successfully created.')
}, (error, req, res, next) => {
    res.status(400).send(error.message)             
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    if(!req.user.avatar)
        return res.status(404).send('Your avatar does not exist.')
    req.user.avatar = undefined
    await req.user.save()
    res.send('Your avatar has been deleted.')
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar)
        {
            throw new Error('Not found.')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send(e)
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