/*
  Warnings:

  - Made the column `location` on table `offer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "offer" ALTER COLUMN "location" SET NOT NULL;
