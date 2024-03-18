import express from 'express'
import {router} from './routes/user.route.js'

const server = express();

const PORT = 8000


server.use('/user',router)

server.listen(PORT,()=>{
    console.log(`server is listening at port =${PORT} `)
})