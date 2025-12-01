/*
  Warnings:

  - Added the required column `capacity` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "capacity" INTEGER NOT NULL;
