import { ClientStatusKey } from "entities/ClientStatus";

export interface Client {
    id?: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    phoneNumber?: string
    email?: string
    anamnesis?: string
    description?: string
    social?: string
    image_3d?: boolean
    document?: boolean
    image?: File | string;
    createdAt?: string
    status?: ClientStatusKey
}

export enum ClientView {
    BIG = 'BIG',
    SMALL = 'SMALL',
}

export interface ServerError {
    status: number;
    message?: string;
}


