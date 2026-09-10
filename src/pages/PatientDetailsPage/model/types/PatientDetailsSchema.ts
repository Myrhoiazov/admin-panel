import { Patient } from '@/entities/Patient';

export interface PatientDetailsSchema {
    isLoading: boolean;
    isStatusUpdating: boolean;
    error?: string;
    data?: Patient;
}
