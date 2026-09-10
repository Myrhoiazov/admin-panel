import { createAsyncThunk } from '@reduxjs/toolkit';
import { PatientMediaType } from '@/entities/Patient';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface CreatePatientMediaPayload {
    patientId: string;
    type: PatientMediaType;
    url: string;
    caption?: string;
    capturedAt?: string;
}

export const createPatientMedia = createAsyncThunk<
    void,
    CreatePatientMediaPayload,
    ThunkConfig<string>
>(
    'patientDetails/createPatientMedia',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, ...data } = payload;

        if (!patientId) {
            return rejectWithValue('Не указан ID пациента');
        }

        try {
            await extra.apiPrivate.post(`/patients/${patientId}/media`, data);
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось добавить медиафайл');
        }
    }
);

