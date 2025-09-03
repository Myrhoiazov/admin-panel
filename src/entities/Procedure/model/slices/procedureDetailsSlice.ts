import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProcedureById } from '../services/fetchProcedureById/fetchProcedureById';
import { ProcedureDetailsSchema } from '../types/procedureDetailsSchema';
import { Procedure } from '../types/procedure';

const initialState: ProcedureDetailsSchema = {
    isLoading: false,
    error: undefined,
    data: undefined,
};

export const procedureDetailsSlice = createSlice({
    name: 'procedureDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProcedureById.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchProcedureById.fulfilled,
                (state, action: PayloadAction<Procedure>) => {
                    state.isLoading = false;
                    state.data = action.payload;
                },
            )
            .addCase(fetchProcedureById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { actions: procedureDetailsActions } = procedureDetailsSlice;
export const { reducer: procedureDetailsReducer } = procedureDetailsSlice;