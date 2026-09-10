import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface DeletePatientMedicalParameterPayload {
    patientId: string;
    parameterId: string;
}

export const deletePatientMedicalParameter = createAsyncThunk<
    void,
    DeletePatientMedicalParameterPayload,
    ThunkConfig<string>
>(
    'patientDetails/deletePatientMedicalParameter',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, parameterId } = payload;

        if (!patientId || !parameterId) {
            return rejectWithValue('Не указан ID пациента или параметра');
        }

        try {
            await extra.apiPrivate.delete(
                `/patients/${patientId}/medical-parameters/${parameterId}`
            );
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось удалить медицинский параметр');
        }
    }
);

