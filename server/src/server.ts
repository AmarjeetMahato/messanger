import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { NextFunction,Response, Request } from "express";
import morgan from "morgan";
import cookieParser  from "cookie-parser"
import { HTTPSTATUS } from "./utils/https.config";
import globalErrorHandler from "./globalError/globalErrorHandler";
import authRoutes from "./rest-api/auth.Routes"
import roleRoutes from "./rest-api/role.Routes"

const PORT  = process.env.PORT! || 5000

// Express 
const app = express();

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

// Global Error Handler
app.use(globalErrorHandler)

// Health Check
app.get("/",(req:Request, res:Response, next:NextFunction)=>{
       res.status(HTTPSTATUS.OK).json({
         message :"Api working perfectly"
       })
})

// Routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/role",roleRoutes);


app.listen(PORT, ()=>{
              console.log(`Server running on PORT ${PORT}`);  
        })  
