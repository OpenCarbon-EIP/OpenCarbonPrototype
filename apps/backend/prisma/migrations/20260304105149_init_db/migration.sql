/*
  Warnings:

  - You are about to drop the column `id_tender` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `registration_number` on the `Company` table. All the data in the column will be lost.
  - The `industry_sector` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Tender` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_offer` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `certification_end_date` to the `Certification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('ONGOING', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_id_tender_fkey";

-- DropForeignKey
ALTER TABLE "Tender" DROP CONSTRAINT "Tender_id_company_fkey";

-- DropIndex
DROP INDEX "Company_registration_number_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "id_tender",
ADD COLUMN     "id_offer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "certification_end_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "registration_number",
DROP COLUMN "industry_sector",
ADD COLUMN     "industry_sector" JSONB;

-- DropTable
DROP TABLE "Tender";

-- DropEnum
DROP TYPE "TenderStatus";

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'OPEN',
    "id_company" TEXT NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Legal" (
    "id" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "iban" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "id_company" TEXT,
    "id_consultant" TEXT,

    CONSTRAINT "Legal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "estimated_end_date" TIMESTAMP(3) NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "payment_status" TEXT NOT NULL,
    "status" "MissionStatus" NOT NULL DEFAULT 'ONGOING',
    "id_company" TEXT NOT NULL,
    "id_consultant" TEXT NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Legal_registration_number_key" ON "Legal"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "Legal_iban_key" ON "Legal"("iban");

-- CreateIndex
CREATE UNIQUE INDEX "Legal_id_company_key" ON "Legal"("id_company");

-- CreateIndex
CREATE UNIQUE INDEX "Legal_id_consultant_key" ON "Legal"("id_consultant");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_id_company_fkey" FOREIGN KEY ("id_company") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_id_offer_fkey" FOREIGN KEY ("id_offer") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legal" ADD CONSTRAINT "Legal_id_company_fkey" FOREIGN KEY ("id_company") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Legal" ADD CONSTRAINT "Legal_id_consultant_fkey" FOREIGN KEY ("id_consultant") REFERENCES "Consultant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_id_company_fkey" FOREIGN KEY ("id_company") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_id_consultant_fkey" FOREIGN KEY ("id_consultant") REFERENCES "Consultant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
