import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Appointment } from '@/entities/Appointment';

export const fetchAppointmentsByDoctorId = createAsyncThunk<
    Appointment[],
    string | undefined,
    ThunkConfig<string>
>(
    'doctorProfile/fetchAppointmentsByDoctorId',
    async (doctorId, { extra, rejectWithValue }) => {
        if (!doctorId) return rejectWithValue('error');
        try {
            const { data } = await extra.apiPrivate.get<Appointment[]>(`/appointments/doctor/${doctorId}`);
            if (!data) throw new Error();
            return data;
        } catch {
            return rejectWithValue('error');
        }
    },
);
