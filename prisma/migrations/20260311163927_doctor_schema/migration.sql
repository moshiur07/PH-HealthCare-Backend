-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "doctor" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "profilePhoto" TEXT,
    "contactNumber" TEXT,
    "address" TEXT,
    "registrationNumber" VARCHAR(50),
    "experience" INTEGER,
    "gender" "Gender",
    "appointmentFee" DOUBLE PRECISION,
    "qualification" TEXT,
    "currentWorkplace" TEXT,
    "designation" TEXT,
    "averageRating" DOUBLE PRECISION DEFAULT 0.0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_email_key" ON "doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_userId_key" ON "doctor"("userId");

-- CreateIndex
CREATE INDEX "idx_doctor_registration_number" ON "doctor"("registrationNumber");

-- CreateIndex
CREATE INDEX "idx_doctor_email" ON "doctor"("email");

-- CreateIndex
CREATE INDEX "idx_doctor_is_deleted" ON "doctor"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_doctor_specialty_doctor_id" ON "doctor_specialties"("doctorId");

-- CreateIndex
CREATE INDEX "idx_doctor_specialty_specialty_id" ON "doctor_specialties"("specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_specialties_doctorId_specialtyId_key" ON "doctor_specialties"("doctorId", "specialtyId");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
