require('./db/mongoose.js')
const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express()
const port = process.env.PORT || 3000

//using express without middleware: new request -> run route handler
//using express with middleware: new request -> do something -> run route handler

app.use(express.json())     //automatically parses incoming json to object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server is up and running on " + port)
})

