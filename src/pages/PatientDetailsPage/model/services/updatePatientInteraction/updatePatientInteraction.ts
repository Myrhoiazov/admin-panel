import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    PatientInteractionChannel,
    PatientInteractionType,
} from '@/entities/Patient';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface UpdatePatientInteractionPayload {
    patientId: string;
    interactionId: string;
    type?: PatientInteractionType;
    channel?: PatientInteractionChannel;
    title?: string;
    details?: string;
}

export const updatePatientInteraction = createAsyncThunk<
    void,
    UpdatePatientInteractionPayload,
    ThunkConfig<string>
>(
    'patientDetails/updatePatientInteraction',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, interactionId, ...data } = payload;

        if (!patientId || !interactionId) {
            return rejectWithValue('Не указан ID пациента или взаимодействия');
        }

        try {
            await extra.apiPrivate.patch(
                `/patients/${patientId}/interactions/${interactionId}`,
                data
            );
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось обновить взаимодействие');
        }
    }
);

