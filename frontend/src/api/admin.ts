import apiClient from './client';
import { Clinic } from './clinics';
import { Booking } from './bookings';

export const createClinic = async (name: string, location: string, description: string): Promise<Clinic> => {
    const response = await apiClient.post('/admin/clinics', { name, location, description });
    return response.data;
};

export const createSlot = async (clinicId: string, start_time: string, duration_minutes: number, capacity: number): Promise<any> => {
    const response = await apiClient.post(`/admin/clinics/${clinicId}/slots`, { start_time, duration_minutes, capacity });
    return response.data;
};

export const getAllBookings = async (): Promise<Booking[]> => {
    const response = await apiClient.get('/admin/bookings');
    return response.data;
};
