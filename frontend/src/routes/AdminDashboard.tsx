import React, { useState, useEffect } from 'react';
import { createClinic, createSlot, getAllBookings } from '../api/admin';
import { getClinics, Clinic } from '../api/clinics';
import { Booking } from '../api/bookings';
import Toast from '../components/Toast';

const AdminDashboard: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [clinicName, setClinicName] = useState('');
  const [clinicLocation, setClinicLocation] = useState('');
  const [clinicDescription, setClinicDescription] = useState('');
  const [selectedClinic, setSelectedClinic] = useState('');
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slotDuration, setSlotDuration] = useState(30);
  const [slotCapacity, setSlotCapacity] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicsData, bookingsData] = await Promise.all([
          getClinics(),
          getAllBookings(),
        ]);
        setClinics(clinicsData);
        setBookings(bookingsData);
        if (clinicsData.length > 0) {
          setSelectedClinic(clinicsData[0].id.toString());
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClinic(clinicName, clinicLocation, clinicDescription);
      setToast({ message: 'Clinic created successfully', type: 'success' });
      // Refresh clinics
      const clinicsData = await getClinics();
      setClinics(clinicsData);
    } catch (err) {
      setToast({ message: 'Failed to create clinic', type: 'error' });
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSlot(selectedClinic, slotStartTime, slotDuration, slotCapacity);
      setToast({ message: 'Slot created successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to create slot', type: 'error' });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Create Clinic</h2>
          <form onSubmit={handleCreateClinic}>
            <input type="text" placeholder="Name" value={clinicName} onChange={(e) => setClinicName(e.target.value)} required />
            <input type="text" placeholder="Location" value={clinicLocation} onChange={(e) => setClinicLocation(e.target.value)} required />
            <textarea placeholder="Description" value={clinicDescription} onChange={(e) => setClinicDescription(e.target.value)} />
            <button type="submit">Create Clinic</button>
          </form>
        </div>

        <div style={{ flex: 1 }}>
          <h2>Create Slot</h2>
          <form onSubmit={handleCreateSlot}>
            <select value={selectedClinic} onChange={(e) => setSelectedClinic(e.target.value)}>
              {clinics.map(clinic => (
                <option key={clinic.id} value={clinic.id}>{clinic.name}</option>
              ))}
            </select>
            <input type="datetime-local" value={slotStartTime} onChange={(e) => setSlotStartTime(e.target.value)} required />
            <input type="number" placeholder="Duration (mins)" value={slotDuration} onChange={(e) => setSlotDuration(parseInt(e.target.value, 10))} required />
            <input type="number" placeholder="Capacity" value={slotCapacity} onChange={(e) => setSlotCapacity(parseInt(e.target.value, 10))} required />
            <button type="submit">Create Slot</button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>All Bookings</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Slot ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Seats</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.slot_id}</td>
                <td>{booking.name}</td>
                <td>{booking.phone}</td>
                <td>{booking.seats_reserved}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;