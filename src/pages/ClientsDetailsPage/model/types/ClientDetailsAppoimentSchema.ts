import { EntityState } from '@reduxjs/toolkit';
import { Appointment } from '@/entities/Appointment';

export interface ClientDetailsAppointmentSchema extends EntityState<Appointment, string> {
    isLoading?: boolean;
    error?: string;
}