#!/bin/bash

API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:3001/api}

# Create a clinic and a slot
echo "--- Creating Clinic and Slot ---"
CREATE_CLINIC_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Expiry Test Clinic","location":"Test Location","description":"Test Description"}' $API_BASE_URL/admin/clinics)
CLINIC_ID=$(echo $CREATE_CLINIC_RESPONSE | sed -n 's/.*"id":\([0-9]*\),.*/\1/p')
CREATE_SLOT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"start_time":"2025-12-12T13:00:00","duration_minutes":30,"capacity":10}' $API_BASE_URL/admin/clinics/$CLINIC_ID/slots)
SLOT_ID=$(echo $CREATE_SLOT_RESPONSE | sed -n 's/.*"id":\([0-9]*\),.*/\1/p')
echo "Clinic ID: $CLINIC_ID, Slot ID: $SLOT_ID"
echo ""

# Book a slot
echo "--- Booking a Slot ---"
BOOK_SLOT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Expiry User","phone":"1234567890","seats_requested":1}' $API_BASE_URL/slots/$SLOT_ID/book)
BOOKING_ID=$(echo $BOOK_SLOT_RESPONSE | sed -n 's/.*"bookingId":\([0-9]*\).*/\1/p')
echo "Booking ID: $BOOKING_ID"
echo ""

# Wait for the booking to expire
echo "--- Waiting for Booking to Expire (2.5 minutes) ---"
sleep 150

# Check the booking status
echo "--- Checking Booking Status ---"
BOOKING_STATUS=$(curl -s $API_BASE_URL/bookings/$BOOKING_ID | sed -n 's/.*"status":"\([^"]*\)".*/\1/p')
echo "Booking Status: $BOOKING_STATUS"
echo ""

# Verify the status is FAILED
if [ "$BOOKING_STATUS" == "FAILED" ]; then
  echo "Expiry test passed!"
else
  echo "Expiry test failed!"
  exit 1
fi
