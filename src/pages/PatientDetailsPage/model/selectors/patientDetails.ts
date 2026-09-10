import { StateSchema } from '@/app/providers/StoreProvider';

export const getPatientDetailsData = (state: StateSchema) => state.patientDetails?.data;
export const getPatientDetailsIsLoading = (state: StateSchema) =>
    state.patientDetails?.isLoading ?? false;
export const getPatientDetailsIsStatusUpdating = (state: StateSchema) =>
    state.patientDetails?.isStatusUpdating ?? false;
export const getPatientDetailsError = (state: StateSchema) => state.patientDetails?.error;

