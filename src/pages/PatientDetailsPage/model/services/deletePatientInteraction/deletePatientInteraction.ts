import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface DeletePatientInteractionPayload {
    patientId: string;
    interactionId: string;
}

export const deletePatientInteraction = createAsyncThunk<
    void,
    DeletePatientInteractionPayload,
    ThunkConfig<string>
>(
    'patientDetails/deletePatientInteraction',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, interactionId } = payload;

        if (!patientId || !interactionId) {
            return rejectWithValue('Не указан ID пациента или взаимодействия');
        }

        try {
            await extra.apiPrivate.delete(`/patients/${patientId}/interactions/${interactionId}`);
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось удалить взаимодействие');
        }
    }
);

