import React, { useState } from 'react';

interface BookingPanelProps {
  slotId: string;
  availableSeats: number;
  onSubmit: (data: { name: string; phone: string; seats: number }) => void;
}

const BookingPanel: React.FC<BookingPanelProps> = ({ slotId, availableSeats, onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, seats });
  };

  const panelStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    maxWidth: '400px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    color: '#333',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const inputStyle: React.CSSProperties = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <div style={panelStyle}>
      <h2>Book Slot {slotId}</h2>
      <form style={formStyle} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="number"
          min="1"
          max={availableSeats}
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value, 10))}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          Request Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPanel;
