const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean, 
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'             // as in line 95, users.js
    }
})

//don't send owner back
taskSchema.methods.toJSON = function(){
    const task = this
    const taskObject = task.toObject()
    delete taskObject['owner']
    return taskObject
}

const Tasks = mongoose.model('Tasks', taskSchema)
module.exports = Tasks