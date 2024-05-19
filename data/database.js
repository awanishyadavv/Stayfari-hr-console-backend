import mongoose from "mongoose";

// Database Connection

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "stayfari-backend",
    })
        .then((c) => console.log(`Database Connected with ${c.connection.host}`))
        .catch((error) => console.log(error));
}


