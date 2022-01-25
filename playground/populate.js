const Task = require('../src/models/tasks')
const User = require('../src/models/users')

const main = async () => {
    const task = await Task.findById("61efe9de86416d5dbc15a729")
    await task.populate('owner')            //returns the whole user as the value of task.owner
    const user = await User.findById("61ee9e7ab439f8f03882ef45")
    await user.populate('tasks')
    console.log(user.tasks)
    console.log(task)
}

main()