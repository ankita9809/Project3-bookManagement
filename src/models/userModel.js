const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    title: {
        type: String, 
        require: true,
        trim: true, 
        enum : ["Mr", "Mrs", "Miss"]
        },  
    name: {
        type: String,
        require: true,
        trim: true 
    }, 
    phone: {
        type: String,
        require: true,
        unique: true, 
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String, 
        require: true,
        trim: true
    },
    address: {
        street: {
            type: String
        },
        city: {
            type: String
        },
        pincode: {
            type: String
        }
    }
},
{timestamps : true});
 
module.exports = mongoose.model ('userDb', userSchema)


