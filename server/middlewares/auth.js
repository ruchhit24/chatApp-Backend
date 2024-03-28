import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies["access_token"];
    console.log("token = ", token);
    
    if (!token) {
        return res.status(401).json({ message: "You must be logged in first!" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded token:", decodedToken);
        req.user = decodedToken._id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export { isAuthenticated };
