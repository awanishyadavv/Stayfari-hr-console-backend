import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Invalid User / Not Loggedin"
        })
    }
    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);

    if (req.user.role !== "intern" && req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. User is not authorized."
        });
    }
    next();
    } catch (error) {
      next(error)  
    }

};

export const isAuthenticatedAdmin = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Invalid User / Not Loggedin"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. User is not authorized."
            });
        }
        next();
    } catch (error) {
        next(error);
    }
}