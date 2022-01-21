require('../src/db/mongoose.js')
const User = require('../src/models/users.js')
const Task = require('../src/models/tasks.js')

//promise chaining
// User.findByIdAndUpdate('61e7fb7612945a839f80a343', {age: 22}).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 22})
// }).then((user2) => console.log(user2))
//     .catch((e) => console.log(e))

//async await
// const updateUserandCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate( id, {age})
//     const count = await User.countDocuments({ age })
//     return {user, count}
// }

// updateUserandCount('61e7f66bd1a475beacb8d289', 23).then(({user, count}) => {
//     console.log(user)
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

//promise chaining
// Task.findByIdAndDelete('61e800126f49b736429deddb').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: true})
// }).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

//async await
const findTaskandDelete = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed: false})
    return {task, count}
}

findTaskandDelete('61e7f0c8827a8c27b3ea3994').then((object) => {
    console.log(object)
}).catch((e) => console.log(e))