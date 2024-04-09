import {faker} from "@faker-js/faker"
import { User } from "../models/user.model.js";

const createUser = async(numOfUsers)=>{
    try {
       const usersPromise=[];
       
       for(let i=0;i<numOfUsers;i++){
       const tempUser = User.create({
          name : faker.person.fullName(),
          username :faker.internet.userName(),
          bio:faker.lorem.sentence(10),
          password : "password",       // fr unique : faker.internet.password();
          avatar : {
              url : faker.image.avatar(),
              publicId : faker.system.fileName(),
      }});
      usersPromise.push(tempUser);
      }
      const newUsers = await Promise.all(usersPromise);
      console.log('uses created = ',newUsers);
      process.exit(1);
      }catch(error){
      console.log(error)
      }}
      
    export { createUser }