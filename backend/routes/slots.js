const express = require('express');
const router = express.Router();
const db = require('../db');
const { withRetries } = require('../utils/concurrency');

// Get details for a specific slot
router.get('/:slotId', (req, res) => {
  try {
    const { slotId } = req.params;
    const stmt = db.prepare('SELECT * FROM slots WHERE id = ?');
    const slot = stmt.get(slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.status(200).json(slot);
  } catch (error) {
    console.error('Error fetching slot:', error);
    res.status(500).json({ error: 'Failed to fetch slot' });
  }
});

// Create a new booking for a slot
router.post('/:slotId/book', async (req, res) => {
    const { slotId } = req.params;
    const { name, phone, seats_requested } = req.body;

    if (!name || !phone || !seats_requested) {
        return res.status(400).json({ error: 'Name, phone, and seats_requested are required' });
    }

    const bookSeatTx = db.transaction(() => {
        const slot = db.prepare('SELECT available FROM slots WHERE id = ?').get(slotId);

        if (!slot) {
            throw new Error('Slot not found');
        }

        if (slot.available < seats_requested) {
            throw new Error('Not enough available seats');
        }

        const { lastInsertRowid } = db.prepare('INSERT INTO bookings (slot_id, name, phone, seats_reserved, status) VALUES (?, ?, ?, ?, ?)')
            .run(slotId, name, phone, seats_requested, 'PENDING');

        db.prepare('UPDATE slots SET available = available - ? WHERE id = ?')
            .run(seats_requested, slotId);

        return { bookingId: lastInsertRowid };
    });

    try {
        const result = await withRetries(() => bookSeatTx());
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating booking:', error);
        if (error.message === 'Slot not found') {
            return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Not enough available seats') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

module.exports = router;
