import jwt from 'jsonwebtoken';

const sendToken = (res, user, statusCode, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    
    return res
        .status(statusCode)
        .cookie("access_token", token, { 
            httpOnly: true, 
            secure: true, // Assuming you're serving over HTTPS
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
            sameSite: "none"
        })
        .json({ success: true, message,user});
};

export { sendToken };
