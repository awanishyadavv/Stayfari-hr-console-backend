import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode=201) => {
        // Tokenization for cookie using JWT
        const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET)
        res
        .status(statusCode)
        .cookie("token",token,{
            httpOnly:true,
            sameSite:process.env.NODE_ENV ==="Development" ? "lax" : "none",
            secure:process.env.NODE_ENV ==="Development" ? false : true,
        }).json({
            success:true,
            message,
            user,
            role:user.role,
    })
}

