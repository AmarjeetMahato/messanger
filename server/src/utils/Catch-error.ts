import { string } from "zod";
import { AppError } from "../globalError/AppError";
import { Message } from "./ErrorCode.ENUM";
import { HTTPSTATUS, HttpStatusCode } from "./https.config";


export class ConflictExceptions extends AppError {
  constructor(
    message?: string,
    errorCode: Message = Message.CONFLICT_ERROR
  ) {
    super(
      message ?? errorCode,   // if message not provided → use enum string
      errorCode,
      HTTPSTATUS.CONFLICT
    );
  }
}


export class NotFoundExceptions extends AppError {
  constructor(
    message?: string,
    errorCode: Message = Message.RESOURCE_NOT_FOUND
  ) {
    super(
      message ?? errorCode,   // if message not provided → use enum string
      errorCode,
      HTTPSTATUS.NOT_FOUND
    );
  }
}

export class AlreadyExistsException extends AppError {
  constructor(
    message?: string,
    errorCode: Message = Message.RESOURCES_ALREADY_EXITS
  ) {
    super(
      message ?? errorCode, // if no custom message → use enum value
      errorCode,
      HTTPSTATUS.CONFLICT
    );
  }
}

export class ForbiddenException extends AppError {
    constructor(
         message:string = Message.ACCESS_FORBIDDEN,
         errorCode?: Message
    ){
        super(
             message,
             errorCode || Message.ACCESS_FORBIDDEN,
             HTTPSTATUS.FORBIDDEN
        )
    }
}

export class TooManyRequestsException extends AppError{
     constructor(
         message:string = Message.ACCESS_FORBIDDEN,
         errorCode?: Message
    ){
        super(
             message,
             errorCode || Message.ACCESS_FORBIDDEN,
             HTTPSTATUS.TOO_MANY_REQUESTS
        )
    }
}

export class BadRequestException extends AppError {
  constructor(
    message:string = Message.BAD_REQUEST,
     errorCode?: Message) {
    super(message, 
       errorCode || Message.BAD_REQUEST, 
       HTTPSTATUS.BAD_REQUEST
    );
  }
}

export class UnauthorizedException extends AppError {
  constructor(
    message: string = Message.INVALID_CREDENTIALS,
    errorCode: Message = Message.INVALID_CREDENTIALS
  ) {
    super(message ?? errorCode, errorCode, HTTPSTATUS.UNAUTHORIZED);
  }
}

export class InternalServerException extends AppError {
  constructor(message:string = Message.INTERNAL_SERVER_ERROR, errorCode?: Message) {
    super(
      message,
      errorCode || Message.INTERNAL_SERVER_ERROR,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
    );
  }
}

export class HttpException extends AppError {
  constructor(
    message: string = "Http Exception Error",
    errorCode?: Message,
    statusCode: number = HTTPSTATUS.INTERNAL_SERVER_ERROR
  ) {
    super(
      message,
      errorCode || Message.INTERNAL_SERVER_ERROR,
      statusCode
    );
  }
}