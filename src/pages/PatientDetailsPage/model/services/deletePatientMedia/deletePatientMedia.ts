import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface DeletePatientMediaPayload {
    patientId: string;
    mediaId: string;
}

export const deletePatientMedia = createAsyncThunk<
    void,
    DeletePatientMediaPayload,
    ThunkConfig<string>
>(
    'patientDetails/deletePatientMedia',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, mediaId } = payload;

        if (!patientId || !mediaId) {
            return rejectWithValue('Не указан ID пациента или медиафайла');
        }

        try {
            await extra.apiPrivate.delete(`/patients/${patientId}/media/${mediaId}`);
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось удалить медиафайл');
        }
    }
);

