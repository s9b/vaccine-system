const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new clinic
router.post('/clinics', (req, res) => {
  try {
    const { name, location, description } = req.body;
    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const stmt = db.prepare('INSERT INTO clinics (name, location, description) VALUES (?, ?, ?)');
    const result = stmt.run(name, location, description);

    res.status(201).json({ id: result.lastInsertRowid, name, location, description });
  } catch (error) {
    console.error('Error creating clinic:', error);
    res.status(500).json({ error: 'Failed to create clinic' });
  }
});

// Create a new slot for a clinic
router.post('/clinics/:clinicId/slots', (req, res) => {
  try {
    const { clinicId } = req.params;
    const { start_time, duration_minutes, capacity } = req.body;

    if (!start_time || !duration_minutes || !capacity) {
      return res.status(400).json({ error: 'start_time, duration_minutes, and capacity are required' });
    }

    const stmt = db.prepare('INSERT INTO slots (clinic_id, start_time, duration_minutes, capacity, available) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(clinicId, start_time, duration_minutes, capacity, capacity);

    res.status(201).json({ id: result.lastInsertRowid, clinic_id: clinicId, start_time, duration_minutes, capacity });
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ error: 'Failed to create slot' });
  }
});

// List all bookings
router.get('/bookings', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM bookings');
    const bookings = stmt.all();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;
