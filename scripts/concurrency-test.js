const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
const ATTEMPTS = parseInt(process.argv[2], 10) || 50;

const createClinicAndSlot = async () => {
    try {
        console.log('--- Creating Clinic and Slot ---');
        const clinicResponse = await axios.post(`${API_BASE_URL}/admin/clinics`, {
            name: 'Concurrency Test Clinic',
            location: 'Test Location',
            description: 'Test Description',
        });
        const clinicId = clinicResponse.data.id;
        console.log(`Clinic created with ID: ${clinicId}`);

        const slotResponse = await axios.post(`${API_BASE_URL}/admin/clinics/${clinicId}/slots`, {
            start_time: '2025-12-12T14:00:00',
            duration_minutes: 30,
            capacity: 10,
        });
        const slotId = slotResponse.data.id;
        console.log(`Slot created with ID: ${slotId}`);
        return slotId;
    } catch (error) {
        console.error('Failed to create clinic and slot:', error.response?.data || error.message);
        process.exit(1);
    }
};


const bookSlot = async (slotId, attempt) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/slots/${slotId}/book`, {
      name: `User ${attempt}`,
      phone: `1234567${attempt.toString().padStart(3, '0')}`,
      seats_requested: 1,
    });
    return { success: true, data: response.data, attempt };
  } catch (error) {
    return { success: false, error: error.response?.data, attempt };
  }
};

const runTest = async () => {
  const slotId = await createClinicAndSlot();

  console.log(`--- Running Concurrency Test ---`);
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Slot ID: ${slotId}`);
  console.log(`Attempts: ${ATTEMPTS}`);
  console.log(`---------------------------------`);

  const promises = [];
  for (let i = 1; i <= ATTEMPTS; i++) {
    promises.push(bookSlot(slotId, i));
  }

  const results = await Promise.all(promises);

  const successfulBookings = results.filter(r => r.success);
  const failedBookings = results.filter(r => !r.success);

  console.log(`\n--- Test Results ---`);
  console.log(`Successful Bookings: ${successfulBookings.length}`);
  console.log(`Failed Bookings: ${failedBookings.length}`);
  console.log(`--------------------`);

  // Verify that the total number of booked seats does not exceed the slot capacity
  try {
    const slotResponse = await axios.get(`${API_BASE_URL}/slots/${slotId}`);
    const slot = slotResponse.data;
    const initialCapacity = slot.capacity;
    const availableSeats = slot.available;
    const reservedSeats = initialCapacity - availableSeats;
    
    console.log(`\n--- Verification ---`);
    console.log(`Slot Capacity: ${initialCapacity}`);
    console.log(`Available Seats: ${availableSeats}`);
    console.log(`Reserved Seats: ${reservedSeats}`);
    console.log(`--------------------`);

    if (reservedSeats > initialCapacity) {
      console.error('!!! Overbooking detected! !!!');
      process.exit(1);
    } else {
      console.log('No overbooking detected.');
    }
  } catch (error) {
    console.error('Failed to verify slot capacity:', error.response?.data || error.message);
  }
};

runTest();
