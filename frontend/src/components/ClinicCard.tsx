import React from 'react';
import { Link } from 'react-router-dom';

interface ClinicCardProps {
  clinic: {
    id: number;
    name: string;
    location: string;
    description: string;
  };
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    maxWidth: '300px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    color: '#333',
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
  };

  return (
    <div style={cardStyle}>
      <h3>{clinic.name}</h3>
      <p>{clinic.location}</p>
      <p>{clinic.description}</p>
      <Link to={`/clinic/${clinic.id}`} style={linkStyle}>
        View Slots
      </Link>
    </div>
  );
};

export default ClinicCard;
