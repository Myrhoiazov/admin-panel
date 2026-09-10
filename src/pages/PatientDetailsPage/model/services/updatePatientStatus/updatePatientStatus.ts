import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { PatientActivityStatus, PatientAttendanceStatus } from '@/entities/Patient';
import { fetchPatientById } from '../fetchPatientById/fetchPatientById';

interface UpdatePatientStatusPayload {
    patientId: string;
    attendanceStatus?: PatientAttendanceStatus;
    activityStatus?: PatientActivityStatus;
}

interface UpdatePatientStatusResponse {
    id: number;
    attendanceStatus: PatientAttendanceStatus;
    activityStatus: PatientActivityStatus;
}

export const updatePatientStatus = createAsyncThunk<
    UpdatePatientStatusResponse,
    UpdatePatientStatusPayload,
    ThunkConfig<string>
>(
    'patientDetails/updatePatientStatus',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;
        const { patientId, attendanceStatus, activityStatus } = payload;

        if (!patientId) {
            return rejectWithValue('Не указан ID пациента');
        }

        try {
            const { data } = await extra.apiPrivate.patch<UpdatePatientStatusResponse>(
                `/patients/${patientId}/status`,
                {
                    attendanceStatus,
                    activityStatus,
                }
            );

            if (!data) {
                throw new Error('Не удалось обновить статус');
            }

            dispatch(fetchPatientById(patientId));
            return data;
        } catch (error) {
            return rejectWithValue('Не удалось обновить статус пациента');
        }
    }
);
