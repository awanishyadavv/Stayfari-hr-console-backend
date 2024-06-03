import express, { Router } from "express";

// User Router import
import userRouter from "./routes/user.js"
import dataRouter from "./routes/data.js"
import accessRouter from "./routes/userAccess.js"
import profilingRouter from "./routes/profiling.js"
import externsionRouter from "./routes/extension.js"



import {config} from "dotenv"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middelwares/error.js";

// Import Cors for Deployment and Server Routing(Check Cors on Internet)

import cors from "cors"
import { rmSync } from "fs";


// App Engine HTML
export const app = express();


config({
    path:"./data/config.env",
});

const allowedOrigins = [process.env.FRONTEND_URL, 'chrome-extension://jjpngjggicplaohkofkohinignkgicel'];
// middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

// Using Routes by Importing Router
app.use("/api/v1/users", userRouter);
app.use("/api/v1/data", dataRouter);
app.use("/api/v1/access", accessRouter);
app.use("/api/v1/profiling", profilingRouter);
app.use("/api/v1/extension", externsionRouter);



app.get("/", (req,res) => {
    res.send("Nice Working")
})

// Error Handelling  Middleware
app.use(errorMiddleware)