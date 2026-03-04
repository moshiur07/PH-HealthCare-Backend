import { Request, Response } from "express";
import catchAsync from "../../../helper/controllerHandler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../../helper/sendResponse";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.registerPatient(payload);
  sendResponse(res, {
    httpStatus: 201,
    success: true,
    data: result,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.loginUser(payload);
  sendResponse(res, {
    httpStatus: 200,
    success: true,
    data: result,
  });
});

export const authController = {
  registerPatient,
  loginUser,
};
