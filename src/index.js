require('./db/mongoose.js')
const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const multer = require('multer')

const app = express()
const port = process.env.PORT || 3000

//using express without middleware: new request -> run route handler
//using express with middleware: new request -> do something -> run route handler

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000       //1 MB
    },
    fileFilter(req, file, cb){
        // if(file.originalname.endsWith('.pdf')){
        //     cb(undefined, true)
        // }
        if(file.originalname.match(/\.(doc|docx)$/))            //regular expression within match
            cb(undefined, true)
        else
            cb(new Error('Only Word documents supported.'))
    }
})


app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {             //function to send all middleware errors
    res.status(400).send(error.message)
})

app.use(express.json())     //automatically parses incoming json to object
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server is up and running on " + port)
})

