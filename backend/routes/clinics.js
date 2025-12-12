const express = require('express');
const router = express.Router();
const db = require('../db');

// List all clinics
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM clinics');
    const clinics = stmt.all();
    res.status(200).json(clinics);
  } catch (error) {
    console.error('Error fetching clinics:', error);
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
});

// List all slots for a specific clinic
router.get('/:clinicId/slots', (req, res) => {
  try {
    const { clinicId } = req.params;
    const stmt = db.prepare('SELECT * FROM slots WHERE clinic_id = ?');
    const slots = stmt.all(clinicId);
    res.status(200).json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});



module.exports = router;
