import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBooking, confirmBooking, Booking } from '../api/bookings';
import Toast from '../components/Toast';
import Confetti from '../components/Confetti';

const BookingStatusPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const data = await getBooking(bookingId);
        setBooking(data);
        if (data.status === 'PENDING') {
          setTimeout(fetchBooking, 5000); // Poll every 5 seconds
        }
      } catch (err) {
        setError('Failed to fetch booking status');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleConfirm = async () => {
    if (!bookingId) return;
    try {
      await confirmBooking(bookingId);
      setToast({ message: 'Booking confirmed!', type: 'success' });
      setShowConfetti(true);
      // Refetch booking to update status
      const data = await getBooking(bookingId);
      setBooking(data);
    } catch (err) {
      setToast({ message: 'Failed to confirm booking', type: 'error' });
    }
  };

  const statusStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '8px',
    margin: '16px 0',
    color: 'white',
    textAlign: 'center',
    backgroundColor:
      booking?.status === 'CONFIRMED'
        ? '#4caf50'
        : booking?.status === 'FAILED'
        ? '#f44336'
        : '#ff9800',
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!booking) return <p>Booking not found</p>;

  return (
    <div>
      {showConfetti && <Confetti />}
      <h1>Booking Status</h1>
      <div style={statusStyle}>
        <h2>Status: {booking.status}</h2>
      </div>
      <p>Name: {booking.name}</p>
      <p>Phone: {booking.phone}</p>
      <p>Seats Reserved: {booking.seats_reserved}</p>
      {booking.status === 'PENDING' && (
        <button onClick={handleConfirm}>Confirm Booking</button>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BookingStatusPage;