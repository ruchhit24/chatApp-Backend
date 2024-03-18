import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name : {
        type :String,
        required : true,
    },
    username : {
        type:String,
        required : true,
        unique : true,
    },
    password : {
        type :String,
        required : true,
        select : false,
    },
    avatar : {
        publicId : {
            type :String,
            required : true,
        },
        url : {
            type :String,
            required : true,
        },
    },
},{ timestamps : true})

export const User = mongoose.model('User',userSchema) 