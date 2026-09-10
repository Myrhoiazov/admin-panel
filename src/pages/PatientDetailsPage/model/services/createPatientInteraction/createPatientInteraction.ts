import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    PatientInteractionChannel,
    PatientInteractionType,
} from '@/entities/Patient';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface CreatePatientInteractionPayload {
    patientId: string;
    type: PatientInteractionType;
    channel?: PatientInteractionChannel;
    title?: string;
    details?: string;
}

export const createPatientInteraction = createAsyncThunk<
    void,
    CreatePatientInteractionPayload,
    ThunkConfig<string>
>(
    'patientDetails/createPatientInteraction',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, ...data } = payload;

        if (!patientId) {
            return rejectWithValue('Не указан ID пациента');
        }

        try {
            await extra.apiPrivate.post(`/patients/${patientId}/interactions`, data);
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось создать взаимодействие');
        }
    }
);

