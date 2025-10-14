import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Appointment } from '@/entities/Appointment';

export const deleteAppoimentById = createAsyncThunk<Appointment, string, ThunkConfig<string>>(
    'appointments/fetchAppointmentById',
    async (appointmentId, thunkAPI) => {
        const { extra, rejectWithValue } = thunkAPI;
        try {
            const response = await extra.apiPrivate.delete<Appointment>(
                `/appointments/${appointmentId}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue('delete');
        }
    }
);
