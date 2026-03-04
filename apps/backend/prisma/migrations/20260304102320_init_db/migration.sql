/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TenderStatus" AS ENUM ('OPEN', 'CLOSED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CONSULTANT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultant" (
    "id" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "professional_title" TEXT NOT NULL,
    "description" TEXT,
    "photo_url" TEXT,
    "rating_score" INTEGER NOT NULL DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Consultant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "certification_name" TEXT NOT NULL,
    "issuing_organization" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "evidence_url" TEXT,
    "id_consultant" TEXT NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "industry_sector" TEXT NOT NULL,
    "company_size" INTEGER,
    "description" TEXT,
    "logo_url" TEXT,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tender" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "TenderStatus" NOT NULL DEFAULT 'OPEN',
    "id_company" TEXT NOT NULL,

    CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "id_tender" TEXT NOT NULL,
    "id_consultant" TEXT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Consultant_id_user_key" ON "Consultant"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "Company_registration_number_key" ON "Company"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_user_key" ON "Company"("id_user");

-- AddForeignKey
ALTER TABLE "Consultant" ADD CONSTRAINT "Consultant_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_id_consultant_fkey" FOREIGN KEY ("id_consultant") REFERENCES "Consultant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tender" ADD CONSTRAINT "Tender_id_company_fkey" FOREIGN KEY ("id_company") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_id_tender_fkey" FOREIGN KEY ("id_tender") REFERENCES "Tender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_id_consultant_fkey" FOREIGN KEY ("id_consultant") REFERENCES "Consultant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
