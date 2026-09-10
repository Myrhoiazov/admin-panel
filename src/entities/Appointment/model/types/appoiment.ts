import { Client } from "@/entities/Client";
import { PaymentMethod } from "@/entities/PaymentMethod";
import { Procedure } from "@/entities/Procedure";
import { User } from "@/entities/User";

export interface AppointmentImageDto {
    id: number;
    url: string;
    appointmentId: number;
}

export type AppointmentImage = AppointmentImageDto | File;

export interface AppointmentServiceLine {
    id?: number;
    serviceItemId: number;
    name: string;
    priceAtBooking: number;
    order?: number;
}

export interface AppointmentProcedureLine {
    id?: number;
    procedureId: number;
    procedure?: Procedure;
    order?: number;
    services: AppointmentServiceLine[];
}

export interface Appointment {
    id?: string;
    clientId?: string;
    doctorId?: string;
    images?: AppointmentImage[];
    procedures?: AppointmentProcedureLine[];

    note?: string;
    createdAt?: string;
    startAt?: string;
    endAt?: string;
    durationMin?: number;
    status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    discountAmount?: number;
    finalAmount?: number;
    paymentMethod?: PaymentMethod | string;
    clientConfirmed?: boolean;
    documentsChecklist?: string | string[];
    documentsLocked?: boolean;
    changeLog?: string;

    client?: Client;
    doctor?: User
}
