//CRUD operations

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectId = mongodb.ObjectId

const { defaultConfiguration } = require('express/lib/application')
const {MongoClient, ObjectId} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
// const id = new ObjectId()   //constructor; generates a new objectid
// console.log(id.getTimestamp(), id)

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error)
    {
        return console.log("Unable to connect to database.")
    }

     const db = client.db(databaseName)

//     db.collection('tasks').insertMany([
//     {
//         description : 'Udemy course',
//         completed: false}
//     , {
//         description: 'monk book',
//         completed: false
//     }, {
//         description: 'chess',
//         completed: true
//     }], (error, result) => {
//     if(error)
//     {
//         return console.log('Unable to add multiple documents.')
//     }

//     console.log(result)
// })

    // db.collection('tasks').findOne({_id: new ObjectId("61e5c16f0c2a855640b6f57f")}, (error, task) => {
    //     if(error)
    //         return console.log("Unable to fetch.")
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed: false}).toArray((error, tasks)=>{       //find returns a pointer
    //     if(error)
    //         return console.log("Unable to fetch.")
    //     console.log(tasks)
    // })

    // db.collection('users').updateOne({ _id: new ObjectId("61e6a4b3ba05697d63619e0b")}, {
    //     $inc: {
    //         age: -2
    //     }
    // }).then((data) => {
    //     console.log(data)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({ completed: false } , {
    //     $set: {
    //         completed: true
    //     }
    // }).then((data) => {
    //     console.log(data)
    // }).catch((error) => {
    //     console.log(error)
    // })

    //db.collection('users')
    //     .deleteOne({ name: 'Tanishka'}).then((data) => console.log(data)).catch((e) => console.log(e))
    //db.collection('tasks').deleteMany({ completed: true}).then((data) => console.log(data)).catch((e) => console.log(e))
 })