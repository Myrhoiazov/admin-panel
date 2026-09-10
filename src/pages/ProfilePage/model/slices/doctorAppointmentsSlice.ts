import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateSchema } from '@/app/providers/StoreProvider';
import { Appointment } from '@/entities/Appointment';
import { fetchAppointmentsByDoctorId } from '../services/fetchAppointmentsByDoctorId';

interface DoctorAppointmentsSchema {
    isLoading?: boolean;
    error?: string;
}

const adapter = createEntityAdapter<Appointment, string>({
    selectId: (a) => a.id as string,
});

export const getDoctorAppointments = adapter.getSelectors<StateSchema>(
    (state) => state.doctorAppointments || adapter.getInitialState(),
);

const doctorAppointmentsSlice = createSlice({
    name: 'doctorAppointments',
    initialState: adapter.getInitialState<DoctorAppointmentsSchema>({
        isLoading: false,
        error: undefined,
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointmentsByDoctorId.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchAppointmentsByDoctorId.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
                state.isLoading = false;
                adapter.setAll(state, action.payload);
            })
            .addCase(fetchAppointmentsByDoctorId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { reducer: doctorAppointmentsReducer } = doctorAppointmentsSlice;
