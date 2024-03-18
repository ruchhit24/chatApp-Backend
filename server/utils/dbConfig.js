import mongoose from "mongoose";

const connectToDb = (uri) =>{
    mongoose.connect(uri)
    .then((data) => console.log(`connect to db: ${data.connection.host}`))
    .catch((err)=>{ throw err; });
  }
  export {connectToDb}

 