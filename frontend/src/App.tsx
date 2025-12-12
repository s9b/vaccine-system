import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import ClinicPage from './routes/ClinicPage';
import BookingPage from './routes/BookingPage';
import BookingStatusPage from './routes/BookingStatusPage';
import AdminDashboard from './routes/AdminDashboard';
import AdminSlots from './routes/AdminSlots';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clinic/:id" element={<ClinicPage />} />
        <Route path="/booking/:slotId" element={<BookingPage />} />
        <Route path="/booking/status/:bookingId" element={<BookingStatusPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/slots" element={<AdminSlots />} />
      </Routes>
    </Router>
  );
}

export default App;
