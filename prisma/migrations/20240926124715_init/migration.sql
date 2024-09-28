/*
  Warnings:

  - You are about to drop the column `name` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `member` table. All the data in the column will be lost.
  - Added the required column `author` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` DROP COLUMN `name`,
    ADD COLUMN `author` VARCHAR(100) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `stock` INTEGER NOT NULL,
    ADD COLUMN `title` VARCHAR(100) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `member` DROP COLUMN `author`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `stock`,
    DROP COLUMN `title`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `name` VARCHAR(100) NOT NULL;
