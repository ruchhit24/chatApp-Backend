import express from 'express'
import {router} from './routes/user.route.js' 
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

dotenv.config()

const server = express();

const PORT = 8000;

server.use(express.json())
server.use(cookieParser())

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

server.use('/user',router);

server.listen(PORT,()=>{
    console.log(`server is listening at port =${PORT} `)
})