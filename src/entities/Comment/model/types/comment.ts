import { Appointment } from 'entities/Appointment';
import { Client } from 'entities/Client';
import { User } from 'entities/User';

export interface Comment {
    id: string;
    text: string;
    author: User;
    createdAt?: string;

    clientId?: number;
    appointmentId?: number;

    client?: Client;
    appointment?: Appointment;
}
