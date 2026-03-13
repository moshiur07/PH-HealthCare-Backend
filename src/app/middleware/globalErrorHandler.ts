/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import z from "zod";
import { IErrorSource } from "../../interfaces/errorInterfaces";
import { handleZodError } from "../../helper/handleZodError";
import AppError from "../../helper/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV == "development") {
    console.log("Error from global error handler", err);
    console.error(err.stack);
  }

  let errorSources: IErrorSource[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let stack: string | undefined;

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
  } else if (err instanceof AppError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse = {
    success: false,
    message: message,
    errorSources: errorSources,
    error: envVars.NODE_ENV === "development" ? err.message : undefined,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
