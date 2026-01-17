-- CreateEnum
CREATE TYPE "VenueStatus" AS ENUM ('DRAFT', 'PENDING', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "status" "VenueStatus" NOT NULL DEFAULT 'PENDING';
