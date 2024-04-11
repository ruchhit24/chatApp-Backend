import { hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name : {
        type :String,
        required : true,
    },
    username : {
        type:String,
        required : true, 
    },
    email : {
        type:String,
        required : true,
        unique : true,
    },
    password : {
        type :String,
        required : true,
        select : false,
    },
    bio : {
        type :String,
        required : true,
    },
    avatar : {
        public_id : {
            type :String,
            required : true,
        },
        url : {
            type :String,
            required : true,
        },
    },
    isVerified : {
        type : Boolean,
        default : false,
        required : true,
    },
},{ timestamps : true})

userSchema.pre("save",async function( next ){
    if(!this.isModified("password")) return next()

    this.password = await hash(this.password,10)
})

export const User = mongoose.model('User',userSchema) 