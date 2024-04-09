import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    name : {
        type :String,
        required : true,
    },
    groupChat : {
        type: Boolean, 
         default : false,
    },
     creator : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    members : [{
        type : mongoose.Types.ObjectId,
        ref : "User"
    }],
    avatar : {
        type : String,
        default : "https://images.unsplash.com/photo-1525026198548-4baa812f1183?q=80&w=1468&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    
},{ timestamps : true})

export const Chat = mongoose.model('Chat',chatSchema) 