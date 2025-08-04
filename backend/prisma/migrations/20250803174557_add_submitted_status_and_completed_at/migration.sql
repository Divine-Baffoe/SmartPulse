-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'submitted';

-- AlterTable
ALTER TABLE "ProjectAssignment" ADD COLUMN     "completedAt" TIMESTAMP(3);
