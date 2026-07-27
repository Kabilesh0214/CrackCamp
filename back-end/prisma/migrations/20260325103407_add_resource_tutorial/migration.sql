/*
  Warnings:

  - Added the required column `imageURL` to the `ResourceTutorial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResourceTutorial" ADD COLUMN     "imageURL" TEXT NOT NULL;
