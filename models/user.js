import { access } from "fs";
import mongoose from "mongoose";

// Database Schema/models
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    employeeCode: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
    },
    access: {
        type: [
            {
                accessDataName: {
                    type: String,
                    required: false
                },
                accessDataId: {
                    type: String,
                    required: true
                },
                accessDataRange: {
                    type: [Number],
                    required:true
                }
            }
        ],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model("User", schema);