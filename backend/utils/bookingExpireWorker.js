const cron = require('node-cron');
const db = require('../db');

const EXPIRE_MINUTES = 2;
const CRON_SCHEDULE = '*/30 * * * * *'; // Every 30 seconds

const expireBookings = () => {
  const expireBookingsTx = db.transaction(() => {
    const twoMinutesAgo = new Date(Date.now() - EXPIRE_MINUTES * 60 * 1000).toISOString();

    const expiredBookingsStmt = db.prepare("SELECT * FROM bookings WHERE status = 'PENDING' AND created_at <= ?");
    const expiredBookings = expiredBookingsStmt.all(twoMinutesAgo);

    if (expiredBookings.length === 0) {
      return;
    }

    console.log(`Expiring ${expiredBookings.length} bookings...`);

    const updateBookingStmt = db.prepare("UPDATE bookings SET status = 'FAILED', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    const updateSlotStmt = db.prepare('UPDATE slots SET available = available + ? WHERE id = ?');

    for (const booking of expiredBookings) {
      updateBookingStmt.run(booking.id);
      updateSlotStmt.run(booking.seats_reserved, booking.slot_id);
    }
  });

  try {
    expireBookingsTx();
  } catch (error) {
    console.error('Error expiring bookings:', error);
  }
};

const start = () => {
  cron.schedule(CRON_SCHEDULE, expireBookings);
  console.log('Booking expiry worker started.');
};

module.exports = { start };
