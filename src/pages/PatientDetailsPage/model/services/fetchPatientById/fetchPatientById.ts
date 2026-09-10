import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Patient } from '@/entities/Patient';
import { PatientApi } from '../../types/patientApi';

const mapPatientApiToEntity = (data: PatientApi): Patient => ({
    id: String(data.id),
    firstName: data.firstName,
    lastName: data.lastName,
    birthday: data.birthday,
    phoneNumber: data.phoneNumber,
    email: data.email,
    image: data.image,
    anamnesis: data.anamnesis,
    social: data.social,
    description: data.description,
    bio: data.bio,
    image3d: data.image_3d,
    hasDocument: data.document,
    attendanceStatus: data.attendanceStatus,
    activityStatus: data.activityStatus,
    interactions: (data.interactionHistory ?? []).map((item) => ({
        id: String(item.id),
        type: item.type,
        channel: item.channel,
        title: item.title,
        details: item.details,
        createdAt: item.createdAt,
        authorId: item.authorId ? String(item.authorId) : undefined,
    })),
    media: (data.mediaFiles ?? []).map((item) => ({
        id: String(item.id),
        type: item.type,
        url: item.url,
        caption: item.caption,
        capturedAt: item.capturedAt,
        createdAt: item.createdAt,
    })),
    medicalParameters: (data.medicalParameters ?? []).map((item) => ({
        id: String(item.id),
        key: item.key,
        value: item.value,
        note: item.note,
        recordedAt: item.recordedAt,
    })),
    createdAt: data.createdAt,
});

export const fetchPatientById = createAsyncThunk<
    Patient,
    string,
    ThunkConfig<string>
>(
    'patientDetails/fetchPatientById',
    async (patientId, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        if (!patientId) {
            return rejectWithValue('Не указан ID пациента');
        }

        try {
            const { data } = await extra.apiPrivate.get<PatientApi>(`/patients/${patientId}`);

            if (!data) {
                throw new Error('Пациент не найден');
            }

            return mapPatientApiToEntity(data);
        } catch (error) {
            return rejectWithValue('Не удалось загрузить пациента');
        }
    }
);
