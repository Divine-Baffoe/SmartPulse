-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('productive', 'unproductive');

-- DropIndex
DROP INDEX "Company_name_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "settings" JSONB;

-- CreateTable
CREATE TABLE "WorkSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "productive" INTEGER NOT NULL,
    "unproductive" INTEGER NOT NULL,
    "undefined" INTEGER NOT NULL,
    "idleTime" INTEGER NOT NULL,
    "appsUsed" JSONB NOT NULL,
    "websitesUsed" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "AlertType" NOT NULL,
    "details" TEXT NOT NULL,
    "activity" JSONB NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkSession" ADD CONSTRAINT "WorkSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
