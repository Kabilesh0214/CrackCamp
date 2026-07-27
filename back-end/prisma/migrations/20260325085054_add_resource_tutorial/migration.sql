/*
  Warnings:

  - You are about to drop the `resourceTutorial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "resourceTutorial";

-- CreateTable
CREATE TABLE "ResourceTutorial" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "skill" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ResourceTutorial_pkey" PRIMARY KEY ("id")
);
