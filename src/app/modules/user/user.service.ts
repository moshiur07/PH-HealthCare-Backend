import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../../helper/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctor } from "./user.interface";

const createDoctor = async (payload: ICreateDoctor) => {
  const specialties: Specialty[] = [];
  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: specialtyId },
    });
    if (!specialty) {
      // throw new Error(`Specialty with ID ${specialtyId} not found`);
      throw new AppError(
        status.NOT_FOUND,
        `Specialty with ID ${specialtyId} not found`,
      );
    }
    specialties.push(specialty);
  }
  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });
  if (userExist) {
    // throw new Error("This user already exist in database!");
    throw new AppError(status.CONFLICT, "This user already exist in database!");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });
  if (!userData.user) {
    // throw new Error("Failed to register the doctor!");
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to register the doctor!",
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });
      const doctorSpecialtyData = specialties.map((specialty) => {
        return {
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        };
      });
      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkplace: true,
          designation: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
              isDeleted: true,
              deletedAt: true,
            },
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transaction error:", error);

    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

// TODO: getDoctorById, updateDoctor, deleteDoctor => soft delete

export const UserServices = {
  createDoctor,
};
