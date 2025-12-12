import apiClient from './client';

export interface Clinic {
  id: number;
  name: string;
  location: string;
  description: string;
}

export interface Slot {
  id: number;
  clinic_id: number;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  available: number;
}

export const getClinics = async (): Promise<Clinic[]> => {
  const response = await apiClient.get('/clinics');
  return response.data;
};

export const getSlotsForClinic = async (clinicId: string): Promise<Slot[]> => {
  const response = await apiClient.get(`/clinics/${clinicId}/slots`);
  return response.data;
};

export const getSlot = async (slotId: string): Promise<Slot> => {
    const response = await apiClient.get(`/slots/${slotId}`);
    return response.data;
};
