const mongoose = require('mongoose')        //composed of the mongodb library itself; easier for us to integrate node with mongodb
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true      //removes spaces before and after name
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error('Invalid email.')
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if(value<0)
                throw new Error('Age must be a positive value.')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password'))
                throw new Error('Password cannot contain "password"')
            else if(value.toLowerCase().includes(this.name.toLowerCase()))
                throw new Error('Password cannot contain your name.')
        }
    },
    tokens: [{                  //array of objects: becomes a sub-document, with an automatic objectID generated
        token: {               //each object has property: token
            required: true,
            type: String 
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

//methods works on instances of User, i.e., user 
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, 'this is the user auth secret')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//statics works on User itself (the model)
userSchema.statics.findByCredentials = async ({email, password}) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login.')
    }  
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login.')
    }
    return user
}

userSchema.virtual('tasks', {
    ref: 'Tasks' ,            //as in tasks.js, line 28
    localField: '_id',
    foreignField: 'owner'
})

//restricting password and tokens array from being sent back in the response
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject['password']
    delete userObject['tokens']
    delete userObject['avatar']
    return userObject               //JSON.stringify returns whatever toJSON returns
}

//if a user is deleted, delete all their tasks as well
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})
//userSchema helps set up middleware
//this function runs before saving
//Hash plain text password before saving
userSchema.pre('save', async function (next) {       //not using arrow function since it doesn't have its own 'this' binding
    const user = this

   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password, 8)
   }

    next()          //tells mongoose to save the user now
})

const User = mongoose.model('User', userSchema)
module.exports = User