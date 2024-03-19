import express from 'express'
import {router as userRouter} from './routes/user.route.js' 
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import {router as chatRouter} from './routes/chat.route.js';
// import { createUser } from './seeders/user.js';

dotenv.config()

const server = express();

const PORT = 8000;

server.use(express.json())
server.use(cookieParser())

// createUser(10)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("mongodb is connected!!")
})
.catch((err)=>{
    console.log(err)
})

server.get('/',(req,res)=>{
    res.send('root page !!')
})

server.use('/user',userRouter);

server.use('/chat',chatRouter)

server.listen(PORT,()=>{
    console.log(`server is listening at port =${PORT} `)
})