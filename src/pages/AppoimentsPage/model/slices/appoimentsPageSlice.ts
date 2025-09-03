import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { StateSchema } from 'app/providers/StoreProvider';
import { fetchAppoimentsList } from '../services/fetchAppoimentsList/fetchAppoimentsList';
import { AppoimentPageSchema } from '../types/AppoimentPageSchema';
import { Appointment } from 'entities/Appointment';

const appoimentAdapter = createEntityAdapter<Appointment, string>({
    selectId: (appointment) => appointment.id as string,
});

export const getAppointments = appoimentAdapter.getSelectors<StateSchema>(
    (state) => state.appoimentPage || appoimentAdapter.getInitialState(),
);

const appoimentsPageSlice = createSlice({
    name: 'appoimentsPageSlice',
    initialState: appoimentAdapter.getInitialState<AppoimentPageSchema>({
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
            .addCase(fetchAppoimentsList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchAppoimentsList.fulfilled, (
                state,
                action: PayloadAction<Appointment[]>,
            ) => {
                state.isLoading = false;

                appoimentAdapter.setAll(state, action.payload);
                state.hasMore = action.payload.length > 0;
            })
            .addCase(fetchAppoimentsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { reducer: appoimentsPageReducer, actions: appoimentsPageActions } = appoimentsPageSlice;
