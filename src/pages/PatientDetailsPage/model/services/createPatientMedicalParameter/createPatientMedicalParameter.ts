import { createAsyncThunk } from '@reduxjs/toolkit';
import { PatientParameterKey } from '@/entities/Patient';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface CreatePatientMedicalParameterPayload {
    patientId: string;
    key: PatientParameterKey;
    value: string;
    note?: string;
}

export const createPatientMedicalParameter = createAsyncThunk<
    void,
    CreatePatientMedicalParameterPayload,
    ThunkConfig<string>
>(
    'patientDetails/createPatientMedicalParameter',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, ...data } = payload;

        if (!patientId) {
            return rejectWithValue('Не указан ID пациента');
        }

        try {
            await extra.apiPrivate.post(`/patients/${patientId}/medical-parameters`, data);
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось добавить медицинский параметр');
        }
    }
);

