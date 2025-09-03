import { Appointment } from "entities/Appointment";
import { ClientStatus } from "entities/ClientStatus";

export interface Client {
    id?: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    phoneNumber?: string
    email?: string
    anamnesis?: string
    description?: string
    image_3d?: boolean
    image?: File | string;
    createdAt?: string
    status?: ClientStatus

    appointments?: Appointment[]
}

export enum ClientView {
    BIG = 'BIG',
    SMALL = 'SMALL',
}

export interface ServerError {
    status: number;
    message?: string;
}


