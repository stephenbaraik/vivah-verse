-- CreateIndex
CREATE INDEX "Venue_city_capacity_idx" ON "Venue"("city", "capacity");

-- CreateIndex
CREATE INDEX "VenueAvailability_venueId_startDate_endDate_idx" ON "VenueAvailability"("venueId", "startDate", "endDate");
