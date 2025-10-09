import {
    createEntityAdapter,
    createSlice, PayloadAction,
} from '@reduxjs/toolkit';
import { Appointment } from 'entities/Appointment';
import { fetchAppoimentsByClientId } from '../services/fetchAppoimentsByClientId/fetchAppoimentsByClientId';

interface InitialState {
    isLoading: boolean;
    error?: string;
    data?: Appointment;
}

const initialState: InitialState = {
    isLoading: false,
    error: undefined,
    data: undefined,
};

const appointmentDetailSlice = createSlice({
    name: 'appointmentDetailsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppoimentsByClientId.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchAppoimentsByClientId.fulfilled, (
                state,
                action: PayloadAction<Appointment>,
            ) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchAppoimentsByClientId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { reducer: appointmentDetailReducer } = appointmentDetailSlice;
export const { actions: appointmentDetailActions } = appointmentDetailSlice;
