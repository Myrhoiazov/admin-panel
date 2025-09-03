import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { ClientSortField } from 'entities/Client';
import { SortOrder } from 'shared/types/sort';
import { fetchAppoimentsList } from '../fetchAppoimentsList/fetchAppoimentsList';


export const initAppoimentPage = createAsyncThunk<
    void,
    URLSearchParams,
    ThunkConfig<string>
>(
    'clientsPage/initClientPage',
    async (searchParams, thunkApi) => {
        const { getState, dispatch } = thunkApi;
        // const inited = getClientsPageInited(getState());

        // if (!inited) {
        //     const orderFromUrl = searchParams.get('order') as SortOrder;
        //     const sortFromUrl = searchParams.get('sort') as ClientSortField;
        //     const searchFromUrl = searchParams.get('search');

        //     if (orderFromUrl) {
        //         dispatch(clientsPageActions.setOrder(orderFromUrl));
        //     }
        //     if (sortFromUrl) {
        //         dispatch(clientsPageActions.setSort(sortFromUrl));
        //     }
        //     if (searchFromUrl) {
        //         dispatch(clientsPageActions.setSearch(searchFromUrl));
        //     }

        //     dispatch(clientsPageActions.initState());
        // }
        dispatch(fetchAppoimentsList({}));
    },
);
