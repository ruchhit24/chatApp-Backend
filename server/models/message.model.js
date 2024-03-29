import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    content : {
        type :String, 
    },
    groupChat : {
        type: Boolean, 
         default : false,
    },
     sender : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true, 
    },
    attachments : [{
        publicId : {
            type :String,
            required : true,
        },
        url : {
            type :String,
            required : true,
        },
    }],
    chat : {
        type : mongoose.Types.ObjectId,
        ref : "Chat",
        required : true,
    },
    
},{ timestamps : true})

export const Message = mongoose.model('Message',messageSchema) 