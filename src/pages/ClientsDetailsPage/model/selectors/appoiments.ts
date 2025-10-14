import { StateSchema } from '@/app/providers/StoreProvider';

export const getClientAppointmentsIsLoading = (state: StateSchema) => state.clientDetailsAppointments?.isLoading;
export const getClientAppointmentsError = (state: StateSchema) => state.clientDetailsAppointments?.error;