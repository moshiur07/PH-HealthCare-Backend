import { Request, Response } from "express";
import catchAsync from "../../../helper/controllerHandler";
import { sendResponse } from "../../../helper/sendResponse";
import status from "http-status";
import { UserServices } from "./user.service";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.createDoctor(payload);
  sendResponse(res, {
    httpStatus: status.CREATED,
    message: "Doctor created successfully!",
    success: true,
    data: result,
  });
});

export const userController = {
  createDoctor,
};
