const express = require('express');
const router = express.Router();
const db = require('../db');

// Check the status of a booking
router.get('/:bookingId', (req, res) => {
  try {
    const { bookingId } = req.params;
    const stmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
    const booking = stmt.get(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Confirm a booking
router.post('/:bookingId/confirm', (req, res) => {
  try {
    const { bookingId } = req.params;
    const stmt = db.prepare("UPDATE bookings SET status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'PENDING'");
    const result = stmt.run(bookingId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found or not in PENDING state' });
    }

    res.status(200).json({ message: 'Booking confirmed' });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});

// Cancel a booking
router.post('/:bookingId/cancel', (req, res) => {
  const cancelBooking = db.transaction((bookingId) => {
    const bookingStmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
    const booking = bookingStmt.get(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status === 'CONFIRMED' || booking.status === 'PENDING') {
      const updateBookingStmt = db.prepare("UPDATE bookings SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
      updateBookingStmt.run(bookingId);

      const updateSlotStmt = db.prepare('UPDATE slots SET available = available + ? WHERE id = ?');
      updateSlotStmt.run(booking.seats_reserved, booking.slot_id);
    }
  });

  try {
    const { bookingId } = req.params;
    cancelBooking(bookingId);
    res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    if (error.message === 'Booking not found') {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
