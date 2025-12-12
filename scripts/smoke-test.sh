#!/bin/bash

sleep 5
# Health check
echo "--- Health Check ---"
curl -s -o /dev/null -w "%{http_code}" -L -v http://localhost:3001/api/health
echo ""

# Create clinic
echo "--- Create Clinic ---"
CREATE_CLINIC_RESPONSE=$(curl -s -L -X POST -H "Content-Type: application/json" -d '{"name":"Test Clinic","location":"Test Location","description":"Test Description"}' http://localhost:3001/api/admin/clinics)
CLINIC_ID=$(echo $CREATE_CLINIC_RESPONSE | sed -n 's/.*"id":\([0-9]*\),.*/\1/p')
echo $CREATE_CLINIC_RESPONSE
echo ""

# Create slot
echo "--- Create Slot ---"
CREATE_SLOT_RESPONSE=$(curl -s -L -X POST -H "Content-Type: application/json" -d '{"start_time":"2025-12-12T12:00:00","duration_minutes":30,"capacity":10}' http://localhost:3001/api/admin/clinics/$CLINIC_ID/slots)
SLOT_ID=$(echo $CREATE_SLOT_RESPONSE | sed -n 's/.*"id":\([0-9]*\),.*/\1/p')
echo $CREATE_SLOT_RESPONSE
echo ""

# Book slot
echo "--- Book Slot ---"
BOOK_SLOT_RESPONSE=$(curl -s -L -X POST -H "Content-Type: application/json" -d '{"name":"Test User","phone":"1234567890","seats_requested":1}' http://localhost:3001/api/slots/$SLOT_ID/book)
BOOKING_ID=$(echo $BOOK_SLOT_RESPONSE | sed -n 's/.*"bookingId":\([0-9]*\).*/\1/p')
echo $BOOK_SLOT_RESPONSE
echo ""

# Get booking status
echo "--- Get Booking Status ---"
curl -s -L http://localhost:3001/api/bookings/$BOOKING_ID
echo ""
