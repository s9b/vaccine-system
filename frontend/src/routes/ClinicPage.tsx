import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSlotsForClinic, Slot } from '../api/clinics';
import SlotGrid from '../components/SlotGrid';

const ClinicPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchSlots = async () => {
      try {
        const data = await getSlotsForClinic(id);
        setSlots(data);
      } catch (err) {
        setError('Failed to fetch slots');
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Available Slots</h1>
      <SlotGrid slots={slots} />
    </div>
  );
};

export default ClinicPage;