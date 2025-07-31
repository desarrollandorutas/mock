-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facebook" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "instagram" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "avatar" SET DEFAULT 'https://imagedelivery.net/ZQvAPo0mWcvFfH0G1AjV7Q/cd265003-13e8-4420-df01-3bdb3e336200/public';
