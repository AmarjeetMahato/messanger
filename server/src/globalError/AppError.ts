import { Message } from "../utils/ErrorCode.ENUM";
import { HTTPSTATUS, HttpStatusCode } from "../utils/https.config";



export  class AppError extends Error {
    public statusCode : HttpStatusCode
    public errorCode?: Message | undefined


    constructor(
        message: string,
        errorCode?: Message,
        statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    ){
        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor)
    }
}