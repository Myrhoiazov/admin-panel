import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppointmentSchema } from '../types/addAppoimentFormSchema';
import { Appointment } from 'entities/Appointment';
import { fetchProceduresList } from '../services/fetchProceduresList/fetchProceduresList';
import { Procedure } from 'entities/Procedure';
import { fetchClientsList } from '../services/fetchClientsList/fetchClientsList';
import { Client } from 'entities/Client';
import { fetchDoctorsList } from '../services/fetchDoctorsList/fetchDoctorsList';
import { User } from 'entities/User';

const initialState: AppointmentSchema = {
    readonly: true,
    isLoading: false,
    error: undefined,
    data: undefined,
    procedures: undefined,
    clients: undefined,
    doctors: undefined,
};

export const appoimentSlice = createSlice({
    name: 'appoiment',
    initialState,
    reducers: {
        setReadonly: (state, action: PayloadAction<boolean>) => {
            state.readonly = action.payload;
        },
        cancelEdit: (state) => {
            state.readonly = true;
        },
        cleanForm: (state) => {
            state.readonly = true;
            state.data = undefined;
        },
        updateAppoiment: (state, action: PayloadAction<Appointment>) => {
            state.data = {
                ...state.data,
                ...action.payload,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProceduresList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchProceduresList.fulfilled,
                (state, action: PayloadAction<Procedure[]>) => {
                    state.isLoading = false;
                    state.procedures = action.payload;
                },
            )
            .addCase(fetchProceduresList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchClientsList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchClientsList.fulfilled,
                (state, action: PayloadAction<Client[]>) => {
                    state.isLoading = false;
                    state.clients = action.payload;
                },
            )
            .addCase(fetchClientsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchDoctorsList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchDoctorsList.fulfilled,
                (state, action: PayloadAction<User[]>) => {
                    state.isLoading = false;
                    state.doctors = action.payload;
                },
            )
            .addCase(fetchDoctorsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export const { actions: appoimentActions } = appoimentSlice;
export const { reducer: appoimentReducer } = appoimentSlice;