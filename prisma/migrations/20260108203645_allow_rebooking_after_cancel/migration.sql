-- DropIndex
DROP INDEX "Booking_venueId_weddingDate_key";

-- CreateIndex
CREATE INDEX "Booking_venueId_weddingDate_idx" ON "Booking"("venueId", "weddingDate");
