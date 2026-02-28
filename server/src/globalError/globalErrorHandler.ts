import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode || 500,
      errorCode: err.errorCode,
      message: err.message || "Something went wrong!",
    });
  } else {
    console.error("Unhandled Error: ", err);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong!',
    });
  }
};

export default globalErrorHandler;