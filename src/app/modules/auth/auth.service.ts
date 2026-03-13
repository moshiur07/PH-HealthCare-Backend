import status from "http-status";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../../../helper/AppError";
import { UserStatus } from "../../../generated/prisma/enums";
import { TokenUtils } from "../../../utils/token";

interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
}

interface ILogInPayload {
  email: string;
  password: string;
}
const registerPatient = async (payload: IRegisterPatientPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });
  if (!data.user) {
    // throw new Error("Failed to register patient!");
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to register patient!",
    );
  }
  try {
    const patient = await prisma.$transaction(async (tx) => {
      return await tx.patient.create({
        data: {
          userId: data.user.id,
          name,
          email,
        },
      });
    });

    const accessToken = TokenUtils.getAccessToken({
      userId: data.user.id,
      email: data.user.email,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
      name: data.user.name,
    });

    const refreshToken = TokenUtils.getRefreshToken({
      userId: data.user.id,
      email: data.user.email,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
      name: data.user.name,
    });

    return {
      ...data,
      patient,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("Transaction error:", error);

    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

const loginUser = async (payload: ILogInPayload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account has been blocked. Please contact support for assistance.",
    );
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account has been deleted. Please contact support for assistance.",
    );
  }

  const accessToken = TokenUtils.getAccessToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
    name: data.user.name,
  });

  const refreshToken = TokenUtils.getRefreshToken({
    userId: data.user.id,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
    name: data.user.name,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

export const authServices = {
  registerPatient,
  loginUser,
};
