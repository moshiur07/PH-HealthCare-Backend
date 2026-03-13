/**
 *  if (err instanceof z.ZodError) {
    
    err.issues.forEach((issue) => {
      errorSources.push({
        path: issue.path.join("->"),
        message: issue.message,
      });
    });
  }**/
import z from "zod";
import { IErrorSource, TErrorResponse } from "../interfaces/errorInterfaces";
import status from "http-status";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
  const statusCode = status.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources: IErrorSource[] = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join("->"),
      message: issue.message,
    });
  });

  return {
    success: false,
    message,
    errorSources,
    statusCode,
  };
};
