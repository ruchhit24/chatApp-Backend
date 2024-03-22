import { compare } from "bcrypt"
import { User } from "../models/user.model.js" 
  import { sendToken } from "../utils/sendToken.js"

export const userTestContoller = (req,res)=>{
  res.send('hellow world')
}

export const newUser = async(req,res) => {

  const {bio,name,username,password} = req.body;
  const file = req.file;

  console.log(file)

  if(!file)
  {
    return res.status(401).json({success  :false , message : "please upload avatar"})
  }


  const avatar = {
  publicId : 'jfjfdckkhk33',
  url : 'jffjfhjfdjh33'
  }
  
  const user = await User.create({ 
  //  name : 'ruchit',
   username : 'ruchhit244',
   password : 'ruchit',
   avatar,
  }
  )
  
  // res.status(201).json({ message : 'user craeted' })

  sendToken(res,user,201,'User Created successfully')
  }

  export const login = async(req,res) =>{ 
    const {username,password } = req.body;
    const user = await User.findOne({username}).select("+password");
    
    if(!user) { return res.status(400).json({message : "invalide username"})}
    
    const isPasswordMatched = await compare(password,user.password);
    
    if(!isPasswordMatched)
    {
    return res.status(400).json({message : "invalide cred"});
    }
    
    sendToken(res,user,200,`welcome back ${user.name}`);
  }

  export const getMyProfile = async(req,res) => {
    const user = await User.findById(req.user)
    res.status(200).json({success : true,user});
  }

  export const logout = (req,res) => {
    return res.status(200).clearCookie("access_token").json({success : true , message : "loggout successfully"})
  }