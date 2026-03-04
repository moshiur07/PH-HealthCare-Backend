import { Response } from "express";

interface IResponseData<T> {
  success: boolean;
  data?: T;
  message?: string;
  httpStatus: number;
}

export const sendResponse = (res: Response, resData: IResponseData<T>) => {
  const { success, data, message, httpStatus } = resData;
  res.status(httpStatus).json({
    success,
    message,
    data,
  });
};
