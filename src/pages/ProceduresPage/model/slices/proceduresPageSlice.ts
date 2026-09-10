import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { StateSchema } from '@/app/providers/StoreProvider';
import { Procedure } from '@/entities/Procedure';
import { fetchProceduresList } from '../services/fetchProceduresList/fetchProceduresList';
import { deleteProcedure } from '../services/deleteProcedure/deleteProcedure';
import { ProcedurePageSchema } from '../types/ProcedurePageSchema';

const clientsAdapter = createEntityAdapter<Procedure, string>({
    selectId: (procedure) => procedure.id as string,
});

export const getProcedures = clientsAdapter.getSelectors<StateSchema>(
    (state) => state.proceduresPage || clientsAdapter.getInitialState(),
);

const proceduresPageSlice = createSlice({
    name: 'proceduresPageSlice',
    initialState: clientsAdapter.getInitialState<ProcedurePageSchema>({
        isLoading: false,
        error: undefined,
        ids: [],
        entities: {},
        page: 1,
        order: 'asc',
        search: '',
        hasMore: true,
        _inited: false
    }),
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        initState: (state) => {
            state._inited = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProceduresList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchProceduresList.fulfilled, (
                state,
                action: PayloadAction<Procedure[]>,
            ) => {
                state.isLoading = false;

                clientsAdapter.setAll(state, action.payload);
                state.hasMore = action.payload.length > 0;
            })
            .addCase(fetchProceduresList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteProcedure.fulfilled, (state, action) => {
                clientsAdapter.removeOne(state, action.payload);
            });
    },
});

export const { reducer: proceduresPageReducer, actions: proceduresPageActions } = proceduresPageSlice;
