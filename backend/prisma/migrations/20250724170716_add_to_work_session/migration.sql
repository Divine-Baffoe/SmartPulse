/*
  Warnings:

  - Added the required column `activeTime` to the `WorkSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appSwitches` to the `WorkSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkSession" ADD COLUMN     "activeTime" INTEGER NOT NULL,
ADD COLUMN     "appSwitches" INTEGER NOT NULL;
