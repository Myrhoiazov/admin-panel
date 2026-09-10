import { createAsyncThunk } from '@reduxjs/toolkit';
import { PatientParameterKey } from '@/entities/Patient';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface UpdatePatientMedicalParameterPayload {
    patientId: string;
    parameterId: string;
    key?: PatientParameterKey;
    value?: string;
    note?: string;
}

export const updatePatientMedicalParameter = createAsyncThunk<
    void,
    UpdatePatientMedicalParameterPayload,
    ThunkConfig<string>
>(
    'patientDetails/updatePatientMedicalParameter',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, parameterId, ...data } = payload;

        if (!patientId || !parameterId) {
            return rejectWithValue('Не указан ID пациента или параметра');
        }

        try {
            await extra.apiPrivate.patch(
                `/patients/${patientId}/medical-parameters/${parameterId}`,
                data
            );
            dispatch(fetchPatientById(patientId));
        } catch (error) {
            return rejectWithValue('Не удалось обновить медицинский параметр');
        }
    }
);

