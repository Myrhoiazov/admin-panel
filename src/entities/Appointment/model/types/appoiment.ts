import { Client } from "@/entities/Client";
import { Procedure } from "@/entities/Procedure";
import { User } from "@/entities/User";

export interface AppointmentImageDto {
    id: number;
    url: string;
    appointmentId: number;
}

export type AppointmentImage = AppointmentImageDto | File;

export interface Appointment {
    id?: string;
    clientId?: string;
    procedureId?: string;
    doctorId?: string;
    images?: AppointmentImage[];

    note?: string;
    createdAt?: string;

    client?: Client;
    procedure?: Procedure;
    doctor?: User
}