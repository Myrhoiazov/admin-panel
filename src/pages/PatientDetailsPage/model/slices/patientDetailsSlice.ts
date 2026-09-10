import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Patient } from '@/entities/Patient';
import { PatientDetailsSchema } from '../types/PatientDetailsSchema';
import { fetchPatientById } from '../services/fetchPatientById/fetchPatientById';
import { updatePatientStatus } from '../services/updatePatientStatus/updatePatientStatus';

const initialState: PatientDetailsSchema = {
    isLoading: false,
    isStatusUpdating: false,
    error: undefined,
    data: undefined,
};

const patientDetailsSlice = createSlice({
    name: 'patientDetails',
    initialState,
    reducers: {
        setPatientData: (state, action: PayloadAction<Patient>) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPatientById.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(fetchPatientById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchPatientById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updatePatientStatus.pending, (state) => {
                state.isStatusUpdating = true;
                state.error = undefined;
            })
            .addCase(updatePatientStatus.fulfilled, (state) => {
                state.isStatusUpdating = false;
            })
            .addCase(updatePatientStatus.rejected, (state, action) => {
                state.isStatusUpdating = false;
                state.error = action.payload;
            });
    },
});

export const { actions: patientDetailsActions } = patientDetailsSlice;
export const { reducer: patientDetailsReducer } = patientDetailsSlice;
