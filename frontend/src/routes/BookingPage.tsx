import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSlot, Slot } from '../api/clinics';
import { createBooking } from '../api/bookings';
import BookingPanel from '../components/BookingPanel';
import Toast from '../components/Toast';

const BookingPage: React.FC = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!slotId) return;
    const fetchSlot = async () => {
      try {
        const data = await getSlot(slotId);
        setSlot(data);
      } catch (err) {
        setError('Failed to fetch slot details');
      } finally {
        setLoading(false);
      }
    };

    fetchSlot();
  }, [slotId]);

  const handleSubmit = async (data: { name: string; phone: string; seats: number }) => {
    if (!slotId) return;
    try {
      const response = await createBooking(slotId, data.name, data.phone, data.seats);
      setToast({ message: 'Booking requested successfully!', type: 'success' });
      setTimeout(() => {
        navigate(`/booking/status/${response.bookingId}`);
      }, 3000);
    } catch (err) {
      setToast({ message: 'Failed to request booking', type: 'error' });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!slot) return <p>Slot not found</p>;

  return (
    <div>
      <BookingPanel slotId={slotId!} availableSeats={slot.available} onSubmit={handleSubmit} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default BookingPage;