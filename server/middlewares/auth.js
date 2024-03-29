import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies["access_token"];
    // console.log("token = ", token);
    
    if (!token) {
        return res.status(401).json({ message: "You must be logged in first!" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded token:", decodedToken);
        req.user = decodedToken._id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


export const socketAuthenticator = async (err, socket, next) => {
    try {
      if (err) console.log(err)
  
      const authToken = socket.request.cookies["access_token"];
  
      if (!authToken)
       console.log("please login to access tis route")
  
      const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
  
      const user = await User.findById(decodedData._id);
  
      if (!user)
        return ;
  
      socket.user = user;
  
      return next();
    } catch (error) {
      console.log(error);
      console.log("please login to access tis route")
    }
  };
export { isAuthenticated };
