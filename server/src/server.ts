import "reflect-metadata"
import "./helpers/container";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { NextFunction,Response, Request } from "express";
import morgan from "morgan";
import cookieParser  from "cookie-parser"
import { HTTPSTATUS } from "./utils/https.config";
import globalErrorHandler from "./globalError/globalErrorHandler";
import authRoutes from "./rest-api/auth.Routes"
import roleRoutes from "./rest-api/role.Routes";
import userRoutes from "./rest-api/user.Routes";
import conversationsRoutes from "./rest-api/conversation.Routes";
import messageRoutes from "./rest-api/message.Routes";
import participentsRoutes from "./rest-api/participents.Routes"
import { SeedRoles } from "./seed/seedRoles";
import cors from "cors";
import {createServer} from "http";
import { intitializeSocket } from "./socket/socket";

const PORT  = process.env.PORT! || 5000

// Express 
const app = express();

const server = createServer(app);


intitializeSocket(server);

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://example.com",
];

// CORS configuration with callback
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) {
      // Allow non-browser requests (like Postman, curl)
      callback(null, true);
      return;
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // origin allowed
    } else {
      callback(new Error("Not allowed by CORS")); // origin not allowed
    }
  },
  credentials: true, // if you want to allow cookies
};

app.use(cors(corsOptions));


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
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/participent",participentsRoutes)
app.use("/api/v1/conversation",conversationsRoutes);
app.use("/api/v1/message",messageRoutes);



async function bootstrap() {
  try {
    await SeedRoles(); // seed first
    
    server.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();