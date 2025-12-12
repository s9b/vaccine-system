import React from 'react';
import Slot from './Slot';

interface SlotGridProps {
  slots: {
    id: number;
    start_time: string;
    duration_minutes: number;
    available: number;
  }[];
}

const SlotGrid: React.FC<SlotGridProps> = ({ slots }) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  };

  return (
    <div style={gridStyle}>
      {slots.map(slot => (
        <Slot key={slot.id} slot={slot} />
      ))}
    </div>
  );
};

export default SlotGrid;
