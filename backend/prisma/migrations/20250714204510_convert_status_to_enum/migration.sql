/*
  Warnings:

  - Changed the type of `status` on the `ProjectAssignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('assigned', 'completed');

-- AlterTable
ALTER TABLE "ProjectAssignment" DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL;
