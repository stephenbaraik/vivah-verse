/*
  Warnings:

  - Added the required column `budgetEstimate` to the `Wedding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wedding" ADD COLUMN     "budgetEstimate" INTEGER NOT NULL;
