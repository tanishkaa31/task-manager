const mongoose = require('mongoose')        //composed of the mongodb library itself; easier for us to integrate node with mongodb

mongoose.connect(process.env.MONGODB_URL)

