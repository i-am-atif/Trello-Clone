/*
  Warnings:

  - You are about to drop the `UserBoard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserBoard" DROP CONSTRAINT "UserBoard_boardId_fkey";

-- DropForeignKey
ALTER TABLE "UserBoard" DROP CONSTRAINT "UserBoard_userId_fkey";

-- DropTable
DROP TABLE "UserBoard";

-- CreateTable
CREATE TABLE "_BoardToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BoardToUser_AB_unique" ON "_BoardToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BoardToUser_B_index" ON "_BoardToUser"("B");

-- AddForeignKey
ALTER TABLE "_BoardToUser" ADD FOREIGN KEY ("A") REFERENCES "Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BoardToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
