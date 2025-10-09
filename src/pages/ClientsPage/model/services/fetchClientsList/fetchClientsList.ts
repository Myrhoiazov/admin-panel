import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Client } from 'entities/Client';
import { getClientsPageOrder, getClientsPageSearch, getClientsPageSort, getClientsPageType } from '../../selectors/clientsPageSelectors';
import { addQueryParams } from 'shared/lib/url/addQueryParams/addQueryParams';
import { ClientStatusKey } from 'entities/ClientStatus';

interface FetchArticlesListProps {
    replace?: boolean;
    noQuery?: boolean
}


export const fetchClientsList = createAsyncThunk<
    Client[],
    FetchArticlesListProps,
    ThunkConfig<string>
>(
    'clientsPage/fetchClientsList',
    async (noQuery, thunkApi) => {
        const { extra, rejectWithValue, getState } = thunkApi;
        const search = getClientsPageSearch(getState());
        const sort = getClientsPageSort(getState());
        const order = getClientsPageOrder(getState());
        const type = getClientsPageType(getState());

        // if (!noQuery && noQuery === undefined) {
        // }
        addQueryParams({
            sort,
            order,
            search,
            type
        });

        try {
            const { data } = await extra.apiPrivate.get<Client[]>('/clients', {
                params: {
                    _q: search,
                    _sortBy: sort,
                    _order: order,
                    _status: type === ClientStatusKey.all ? null : type
                }
            });

            if (!data) {
                throw new Error();
            }

            return data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
