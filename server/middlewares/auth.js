import  jwt from "jsonwebtoken";

const isAuthenticated = async(req,res,next)=>{
    const token = req.cookies["access_token"];
    console.log("token = ",token)
    if(!token)
    {
        return res.status(401).json({message : "u must b loogedin first!!"})
    }
    const decodedToken =  jwt.verify(token,process.env.JWT_SECRET);
    console.log("decoded tokwn : ",decodedToken);

    req.user = decodedToken._id;
    next();
}

export{isAuthenticated}