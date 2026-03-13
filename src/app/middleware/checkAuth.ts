import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtils } from "../../utils/cookie";
import AppError from "../../helper/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { envVars } from "../../config/env";
import { JwtUtils } from "../../utils/jwt";

export const checkAuth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ! Session token verification
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No session token provided.",
        );
      }

      if (sessionToken) {
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: { gt: new Date() },
          },
          include: {
            user: true,
          },
        });
        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;
          const now = new Date();
          const expiresAt = sessionExist.expiresAt;
          const createdAt = sessionExist.createdAt;
          const sessionLifetime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentageRemaining = (timeRemaining / sessionLifetime) * 100;
          if (percentageRemaining < 20) {
            res.setHeader("X-Session-Expiring-Soon", "true");
            res.setHeader("X-Session-Expiration-Time", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
            console.log("session expiring soon!");
          }
          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.FORBIDDEN,
              "Your account is blocked or deleted. Please contact support.",
            );
          }
          if (user.isDeleted) {
            throw new AppError(
              status.FORBIDDEN,
              "Your account is deleted. Please contact support.",
            );
          }
          if (roles.length > 0 && !roles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "You are not authorized to access this resource.",
            );
          }
        }

        const accessToken = CookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized access! No access token provided.",
          );
        }
      }

      // ! AccessToken verification
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No access token provided.",
        );
      }
      const verifyToken = JwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET as string,
      );
      if (!verifyToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token.",
        );
      }
      if (roles.length > 0 && !roles.includes(verifyToken.data!.role as Role)) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
