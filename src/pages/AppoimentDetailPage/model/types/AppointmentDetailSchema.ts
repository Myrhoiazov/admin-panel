import { Appointment } from 'entities/Appointment';

export interface AppointmentDetailSchema {
    isLoading?: boolean;
    error?: string;
    data?: Appointment;
}