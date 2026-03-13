import { Request, Response } from "express";
import catchAsync from "../../../helper/controllerHandler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../../helper/sendResponse";
import status from "http-status";
import { TokenUtils } from "../../../utils/token";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.registerPatient(payload);
  const { accessToken, refreshToken, token, ...rest } = result;

  TokenUtils.setAccessTokenCookie(res, accessToken);
  TokenUtils.setRefreshTokenCookie(res, refreshToken);
  TokenUtils.setBetterAuthSessionCookie(res, token as string);
  sendResponse(res, {
    httpStatus: status.CREATED,
    success: true,
    data: {
      ...rest,
      token,
      accessToken,
      refreshToken,
    },
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authServices.loginUser(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  TokenUtils.setAccessTokenCookie(res, accessToken);
  TokenUtils.setRefreshTokenCookie(res, refreshToken);
  TokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatus: status.OK,
    success: true,
    data: {
      ...rest,
      token,
      accessToken,
      refreshToken,
    },
  });
});

export const authController = {
  registerPatient,
  loginUser,
};
