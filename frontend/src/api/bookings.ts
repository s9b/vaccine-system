import apiClient from './client';

export interface Booking {
  id: number;
  slot_id: number;
  name: string;
  phone: string;
  seats_reserved: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
}

export const createBooking = async (slotId: string, name: string, phone: string, seats_reserved: number): Promise<{ bookingId: number }> => {
  const response = await apiClient.post(`/slots/${slotId}/book`, { name, phone, seats_reserved });
  return response.data;
};

export const getBooking = async (bookingId: string): Promise<Booking> => {
  const response = await apiClient.get(`/bookings/${bookingId}`);
  return response.data;
};

export const confirmBooking = async (bookingId: string): Promise<{ message: string }> => {
    const response = await apiClient.post(`/bookings/${bookingId}/confirm`);
    return response.data;
};
