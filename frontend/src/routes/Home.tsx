import React, { useEffect, useState } from 'react';
import { getClinics, Clinic } from '../api/clinics';
import ClinicCard from '../components/ClinicCard';
import Header3D from '../components/Header3D';

const Home: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await getClinics();
        setClinics(data);
      } catch (err) {
        setError('Failed to fetch clinics');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const listStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={containerStyle}>
      <Header3D />
      <h1>Clinics</h1>
      <div style={listStyle}>
        {clinics.map(clinic => (
          <ClinicCard key={clinic.id} clinic={clinic} />
        ))}
      </div>
    </div>
  );
};

export default Home;