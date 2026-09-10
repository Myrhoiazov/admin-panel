import { StateSchema } from '@/app/providers/StoreProvider';

export const getDoctorAppointmentsIsLoading = (state: StateSchema) =>
    state.doctorAppointments?.isLoading;
export const getDoctorAppointmentsError = (state: StateSchema) =>
    state.doctorAppointments?.error;
