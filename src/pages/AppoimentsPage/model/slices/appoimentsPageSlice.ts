import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

import { StateSchema } from 'app/providers/StoreProvider';
import { fetchAppoimentsList } from '../services/fetchAppoimentsList/fetchAppoimentsList';
import { AppoimentPageSchema } from '../types/AppoimentPageSchema';
import { Appointment } from 'entities/Appointment';
import { SortOrder } from 'shared/types/sort';
import { ClientSortField } from 'entities/Client';

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
        sort: ClientSortField.CREATED,
        search: '',
        hasMore: true,
        _inited: false
    }),
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        setSort: (state, action: PayloadAction<ClientSortField>) => {
            state.sort = action.payload;
        },
        setOrder: (state, action: PayloadAction<SortOrder>) => {
            state.order = action.payload;
        },
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
                action,
            ) => {
                state.isLoading = false;
                state.hasMore = action.payload.length > 0;

                if (action.meta.arg.replace) {
                    appoimentAdapter.setAll(state, action.payload);
                } else {
                    appoimentAdapter.addMany(state, action.payload);
                }

            })
            .addCase(fetchAppoimentsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { reducer: appoimentsPageReducer, actions: appoimentsPageActions } = appoimentsPageSlice;
