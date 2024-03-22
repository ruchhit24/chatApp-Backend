import express from 'express'
import {router as userRouter} from './routes/user.route.js' 
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import {router as chatRouter} from './routes/chat.route.js';
// import { createMessageInChat } from './seeders/chat.js';
// import { createGroupChats, createSingleChats } from './seeders/chat.js';
// import { createUser } from './seeders/user.js';
import {Server} from 'socket.io'
import {createServer} from 'http'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import {v4 as uuid} from 'uuid'
import { getSockets } from './utils/features.js';
import { Message } from './models/message.model.js';
 

dotenv.config()

const server = express();

const PORT = 8000;

server.use(express.json())
server.use(cookieParser())

// createUser(10)

// createSingleChats(10)
// createGroupChats(10)

// createMessageInChat('65f9873eca6aa167e365afeb',50)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("mongodb is connected!!")
})
.catch((err)=>{
    console.log(err)
})

const user = { _id: 'sjnvd88', name: 'jack' };
const userSocketIds = new Map(); // Initialize a Map to store user socket IDs

const server2 = createServer(server);
const io = new Server(server2, {});

io.on("connection", (socket) => {
    console.log('A user is connected with socketId = ', socket.id);
    const { _id } = user;

    // Store user's socket ID
    userSocketIds.set(_id.toString(), socket.id);

    // NEW EVENT FOR CHAT-MESSAGE
    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: { _id: user._id, name: user.name },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };
        console.log(NEW_MESSAGE, messageForRealTime);

        // Broadcast message to other members
        const messageForDb = {
            content: message,
            sender: _id,
            chat: chatId,
        };

        // Get sockets of all members
        const membersSocket = getSockets(members);

        // Emit message to all members
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealTime,
        });

        // Emit alert about new message
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

        // Store message in database
        await Message.create(messageForDb);
        console.log("saved to db")
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        // Remove user's socket ID on disconnect
        userSocketIds.delete(_id.toString());
    });
});



server.get('/',(req,res)=>{
    res.send('root page !!')
})

server.use('/user',userRouter);

server.use('/chat',chatRouter)

server2.listen(PORT,()=>{
    console.log(`server is listening at port =${PORT} `)
})