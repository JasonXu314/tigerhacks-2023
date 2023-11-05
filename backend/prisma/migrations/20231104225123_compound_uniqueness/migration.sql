/*
  Warnings:

  - A unique constraint covering the columns `[name,roomId]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Player_name_key` ON `Player`;

-- CreateIndex
CREATE UNIQUE INDEX `Player_name_roomId_key` ON `Player`(`name`, `roomId`);
