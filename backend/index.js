const express = require('express');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const clinicsRoutes = require('./routes/clinics');
const bookingsRoutes = require('./routes/bookings');
const slotsRoutes = require('./routes/slots');
const bookingExpireWorker = require('./utils/bookingExpireWorker');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/clinics', clinicsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/slots', slotsRoutes);

// Start the booking expiry worker
bookingExpireWorker.start();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
