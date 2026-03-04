import { Request, Response } from "express";
import { specialtyService } from "./specialty.service";
import catchAsync from "../../../helper/controllerHandler";
import { sendResponse } from "../../../helper/sendResponse";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const resData = await specialtyService.createSpecialty(payload);
  sendResponse(res, {
    success: true,
    data: resData,
    httpStatus: 201,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const resData = await specialtyService.getAllSpecialties();
  sendResponse(res, {
    success: true,
    data: resData,
    httpStatus: 200,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await specialtyService.deleteSpecialty(id as string);
  sendResponse(res, {
    success: true,
    message: "Specialty deleted successfully",
    httpStatus: 200,
  });
});

export const specialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
};
