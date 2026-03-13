import status from "http-status";
import catchAsync from "../../../helper/controllerHandler";
import { sendResponse } from "../../../helper/sendResponse";
import { DoctorServices } from "./doctor.service";
import { Request, Response } from "express";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await DoctorServices.getAllDoctors();
  sendResponse(res, {
    httpStatus: status.OK,
    message: "Doctors retrieved successfully!",
    success: true,
    data: result,
  });
});

export const DoctorController = {
  getAllDoctors,
};
