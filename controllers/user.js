import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middelwares/error.js";

export const login = async (req, res, next) => {
    try {
        const { email, employeeCode, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) return next(new ErrorHandler("Invalid Email or Employee or Password", 400))
        if (employeeCode !== user.employeeCode) return next(new ErrorHandler("Invalid Email or Employee or Password", 400))
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return next(new ErrorHandler("Invalid Email or Password", 404))
        sendCookie(user, res, `Welcome Back, ${user.name}`, 200);
    } catch (error) {
        next(error)
    }
};

export const getMyProfile = (req,res) => {
    res.status(200).json({
        success:true,
        user:req.user,
    })
};



export const register = async (req, res, next) => {
    try {
        const { name, email, employeeCode, password, role } = req.body;
        let user = await User.findOne({ email });
        let employee = await User.findOne({ employeeCode });

        if (user) return next(new ErrorHandler("User already Exist", 404))
        if (employee) return next(new ErrorHandler("User already Exist", 404))

        const hashedPassword = await bcrypt.hash(password, 10)
        user = await User.create({ name, email, employeeCode, password: hashedPassword, role });
        res.status(200).json({
            success:true,
            message:`${name} registerd successfully`
        })
    } catch (error) {
        next(error)
    }
};

export const getAllUserforAdmin = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(201).json({
            success: true,
            users,
        })
    } catch (error) {
        next(error)
    }
};

export const logout = (req, res) => {
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true,
        }).json({
            success: true,
            user: req.user,
        })
}


export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) return next(new ErrorHandler("User not Found", 404))

        await user.deleteOne();

        res.status(201).json({
            success: true,
            message: "User Deleted"
        })
    } catch (error) {
        next(error)
    }
};