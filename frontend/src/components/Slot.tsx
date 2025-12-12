import React from 'react';
import { Link } from 'react-router-dom';

interface SlotProps {
  slot: {
    id: number;
    start_time: string;
    duration_minutes: number;
    available: number;
  };
}

const Slot: React.FC<SlotProps> = ({ slot }) => {
  const slotStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    textAlign: 'center',
    backgroundColor: slot.available > 0 ? '#e3f2fd' : '#f0f0f0',
    color: slot.available > 0 ? '#333' : '#999',
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    pointerEvents: slot.available > 0 ? 'auto' : 'none',
  };

  return (
    <div style={slotStyle}>
      <p>Time: {new Date(slot.start_time).toLocaleTimeString()}</p>
      <p>Available: {slot.available}</p>
      <Link to={`/booking/${slot.id}`} style={linkStyle}>
        Book Now
      </Link>
    </div>
  );
};

export default Slot;
