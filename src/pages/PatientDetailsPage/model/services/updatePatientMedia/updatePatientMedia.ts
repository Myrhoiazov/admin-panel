import { createAsyncThunk } from '@reduxjs/toolkit';
import { PatientMediaType } from '@/entities/Patient';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface UpdatePatientMediaPayload {
    patientId: string;
    mediaId: string;
    type?: PatientMediaType;
    url?: string;
    caption?: string;
}

export const updatePatientMedia = createAsyncThunk<
    void,
    UpdatePatientMediaPayload,
    ThunkConfig<string>
>(
    'patientDetails/updatePatientMedia',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, mediaId, ...data } = payload;

        if (!patientId || !mediaId) {
            return rejectWithValue('Не указан ID пациента или медиафайла');
        }

        try {
            await extra.apiPrivate.patch(`/patients/${patientId}/media/${mediaId}`, data);
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось обновить медиафайл');
        }
    }
);

