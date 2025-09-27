/*
  Warnings:

  - You are about to drop the column `retiredQuantity` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "retiredQuantity",
ADD COLUMN     "quantity" INTEGER;
