import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddProcedureFormSchema } from '../types/addProcedureFormSchema';
import { Procedure } from 'entities/Procedure/model/types/procedure';
import { createProcedure } from '../services/createProcedure';

const initialState: AddProcedureFormSchema = {
    isLoading: false,
    data: undefined,
    error: undefined
};

export const addProcedureFormSlice = createSlice({
    name: 'addProcedureForm',
    initialState,
    reducers: {
        createProcedure: (state, action: PayloadAction<Procedure>) => {
            state.data = {
                ...state.data,
                ...action.payload,
                blocks: {
                    ...state.data?.blocks,
                    ...action.payload.blocks,
                },
            };

        },
        cancelEdit: (state) => {
            state.data = undefined;
            state.error = undefined;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProcedure.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                createProcedure.fulfilled,
                (state, action: PayloadAction<Procedure>) => {
                    state.isLoading = false;
                    state.data = action.payload;
                },
            )
            .addCase(createProcedure.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    },
});

export const { actions: addProcedureFormActions } = addProcedureFormSlice;
export const { reducer: addProcedureFormReducer } = addProcedureFormSlice;