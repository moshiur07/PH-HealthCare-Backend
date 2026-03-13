import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import catchAsync from "../../../helper/controllerHandler";
import { sendResponse } from "../../../helper/sendResponse";
import status from "http-status";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const resData = await specialtyService.createSpecialty(payload);
  sendResponse(res, {
    success: true,
    data: resData,
    httpStatus: status.CREATED,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const resData = await specialtyService.getAllSpecialties();
  sendResponse(res, {
    success: true,
    data: resData,
    httpStatus: status.OK,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await specialtyService.deleteSpecialty(id as string);
  sendResponse(res, {
    success: true,
    message: "Specialty deleted successfully",
    httpStatus: status.OK,
  });
});

export const specialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
};
