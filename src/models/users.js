const mongoose = require('mongoose')        //composed of the mongodb library itself; easier for us to integrate node with mongodb
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true      //removes spaces before and after name
    }, 
    email: {
        type: String,
        required: true,
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
    }
})

module.exports = User