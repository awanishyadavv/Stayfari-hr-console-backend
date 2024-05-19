import mongoose from "mongoose";

// Database Schema/models
const schema = new mongoose.Schema({
    fileName: {
        type: String,
        require: true,
    },
    filePath: {
        type: String,
        require: true,
    },
    data: {
        type:[],
        require:true
    },
    createdAt:{
        type:Date, 
        default:Date.now,
    }
});

export const Data = mongoose.model("Data", schema);