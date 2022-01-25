const express = require('express')
const Task = require('../models/tasks.js')
const auth = require('../middleware/auth')

const router = new express.Router()

//create task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task (req.body)
    // task.owner = req.user._id
    const task = new Task({
        ...req.body,            //spread operator
        owner: req.user._id
    })
    try{
        await task.save()
     //   console.log(task) //--> contains 'owner'; res.send(task) doesn't send the owner key due to stringify 
     // however task always had the entry of owner
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }   
})

router.get('/tasks', auth, async (req, res) => {
    try{
        const tasks = await Task.find({owner: req.user._id})
        //await req.user.populate('tasks')
        //res.send(req.user.tasks)
        res.send(tasks)
    }catch(e){
        res.status(500).send(e)
    } 
})

router.get('/tasks/:id', auth, async (req, res) => {  
    const _id = req.params.id
    try{
   // const task = await Task.findById(_id)
      const task = await Task.findOne({_id, owner: req.user._id})
    if(!task){
        return res.status(404).send('Task not found.')
    }
    res.send(task)
  }catch(e){
    res.status(500).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {

    const allowedUpdates = ['description', 'completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    
    if(!isValidOperation){
        return res.status(400).send("Invalid update.")
    }

    try{
       // const task = await Task.findById(req.params.id)
       const task = await Task.findOne({_id:req.params.id, owner: req.user._id})

      //  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task){
            return res.status(404).send("Task not found.")
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()                 //to save the task in mongoDB

        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})
 
router.delete('/tasks/:id', auth, async (req, res) => {

    try{
       const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})

        if(!task){
            return res.status(404).send("Task not found.")
        }

        res.send(task)

    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router