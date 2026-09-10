import { Client } from '@/entities/Client';

export type PatientAttendanceStatus = 'UNKNOWN' | 'ARRIVED' | 'NO_SHOW' | 'CANCELLED';
export type PatientActivityStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type PatientInteractionType =
    | 'CALL'
    | 'MESSAGE'
    | 'VISIT'
    | 'NOTE'
    | 'STATUS_CHANGE';

export type PatientInteractionChannel =
    | 'PHONE'
    | 'WHATSAPP'
    | 'TELEGRAM'
    | 'INSTAGRAM'
    | 'EMAIL'
    | 'VISIT'
    | 'OTHER';

export type PatientMediaType = 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'OTHER';

export type PatientParameterKey =
    | 'WRINKLES'
    | 'SMAS'
    | 'CONTOURS'
    | 'ELASTICITY'
    | 'HYDRATION'
    | 'PIGMENTATION'
    | 'SCARS'
    | 'OTHER';

export interface PatientInteraction {
    id: string;
    type: PatientInteractionType;
    channel?: PatientInteractionChannel;
    title?: string;
    details?: string;
    createdAt: string;
    authorId?: string;
}

export interface PatientMediaItem {
    id: string;
    type: PatientMediaType;
    url: string;
    caption?: string;
    capturedAt?: string;
    createdAt: string;
}

export interface PatientMedicalParameter {
    id: string;
    key: PatientParameterKey;
    value: string;
    note?: string;
    recordedAt: string;
}

export interface Patient {
    id: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    phoneNumber?: string;
    email?: string;
    bio?: string;
    anamnesis?: string;
    social?: string;
    description?: string;
    image?: string;
    image3d?: boolean;
    hasDocument?: boolean;
    attendanceStatus: PatientAttendanceStatus;
    activityStatus: PatientActivityStatus;
    interactions: PatientInteraction[];
    media: PatientMediaItem[];
    medicalParameters: PatientMedicalParameter[];
    createdAt?: string;
}

export type PatientDraft = Omit<Patient, 'id' | 'createdAt'>;

export const mapClientToPatient = (client?: Client): Patient | undefined => {
    if (!client?.id) {
        return undefined;
    }

    return {
        id: String(client.id),
        firstName: client.firstName,
        lastName: client.lastName,
        birthday: client.birthday,
        phoneNumber: client.phoneNumber,
        email: client.email,
        anamnesis: client.anamnesis,
        description: client.description,
        social: client.social,
        image: typeof client.image === 'string' ? client.image : undefined,
        image3d: client.image_3d,
        hasDocument: client.document,
        attendanceStatus: 'UNKNOWN',
        activityStatus: 'ACTIVE',
        interactions: [],
        media: [],
        medicalParameters: [],
        createdAt: client.createdAt,
    };
};
