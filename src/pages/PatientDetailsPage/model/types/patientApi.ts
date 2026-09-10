import {
    PatientInteractionChannel as InteractionChannel,
    PatientInteractionType as InteractionType,
    PatientActivityStatus,
    PatientAttendanceStatus,
    PatientMediaType,
    PatientParameterKey,
} from '@/entities/Patient';

export interface PatientInteractionApi {
    id: number;
    type: InteractionType;
    channel?: InteractionChannel;
    title?: string;
    details?: string;
    createdAt: string;
    authorId?: number;
}

export interface PatientMediaApi {
    id: number;
    type: PatientMediaType;
    url: string;
    caption?: string;
    capturedAt?: string;
    createdAt: string;
}

export interface PatientMedicalParameterApi {
    id: number;
    key: PatientParameterKey;
    value: string;
    note?: string;
    recordedAt: string;
}

export interface PatientApi {
    id: number;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    phoneNumber?: string;
    email?: string;
    image?: string;
    createdAt?: string;
    anamnesis?: string;
    social?: string;
    description?: string;
    bio?: string;
    image_3d?: boolean;
    document?: boolean;
    attendanceStatus: PatientAttendanceStatus;
    activityStatus: PatientActivityStatus;
    interactionHistory?: PatientInteractionApi[];
    mediaFiles?: PatientMediaApi[];
    medicalParameters?: PatientMedicalParameterApi[];
}
