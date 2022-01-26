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

//pagination -> display results in the form of pages (either explicitly click on pages, or view more while scrolling, or infinite scrolling, etc.)
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed){                                            //convert string to boolean, since req.query.completed = string
        match.completed = req.query.completed === 'true'}
    if(req.query.description){
        match.description = req.query.description}          //won't work directly in match within populate, because the condition to check whether completed and description are present is crucial. If they aren't present, then tasks would be searched for description: undefined, and completed: false, giving wrong results
    if(req.query.sortBy){
        const parts =  req.query.sortBy.split(':')                  //-1 for desc, 1 for asc; GET /tasks?sortBy=createdAt:asc
        sort[parts[0]] = parts[1] === 'asc'?1:-1
    }
    try{
        //const tasks = await Task.find({owner: req.user._id})              //returns all the tasks created by the user
        await req.user.populate({
            path: 'tasks',
            match,          //filtering
            options: {
                limit: parseInt(req.query.limit),      //converts string to a number; everything in the query = key-value pair with value = string (even the numbers)
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
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