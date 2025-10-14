import {
    createEntityAdapter,
    createSlice, PayloadAction,
} from '@reduxjs/toolkit';

import { StateSchema } from '@/app/providers/StoreProvider';
import { Appointment } from '@/entities/Appointment';
import { fetchAppoimentsByClientId } from '../services/fetchAppoimentsByClientId/fetchAppoimentsByClientId';
import { ClientDetailsAppointmentSchema } from '../types/ClientDetailsAppoimentSchema';

const appointmentsAdapter = createEntityAdapter<Appointment, string>({
    selectId: (appointment) => appointment.id as string,
});

export const getClientAppointments = appointmentsAdapter.getSelectors<StateSchema>(
    (state) => state.clientDetailsAppointments || appointmentsAdapter.getInitialState(),
);

const clientDetailsAppointmentsSlice = createSlice({
    name: 'clientDetailsAppointmentsSlice',
    initialState: appointmentsAdapter.getInitialState<ClientDetailsAppointmentSchema>({
        isLoading: false,
        error: undefined,
        ids: [],
        entities: {},
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppoimentsByClientId.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchAppoimentsByClientId.fulfilled, (
                state,
                action: PayloadAction<Appointment[]>,
            ) => {
                state.isLoading = false;
                appointmentsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchAppoimentsByClientId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { reducer: clientDetailsAppointmentsReducer } = clientDetailsAppointmentsSlice;
