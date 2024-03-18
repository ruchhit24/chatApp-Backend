import { User } from "../models/user.model.js"

export const userTestContoller = (req,res)=>{
  res.send('hellow world')
}

export const newUser = async(req,res) => {
  const avatar = {
  publicId : 'jfjfk',
  url : 'jffjf'
  }
  
  await User.create({ 
   name : 'ffd',
   username : 'ddj',
   password : 'ffj',
   avatar,
  }
  )
  
  res.status(201).json({ message : 'user craeted' })
  }