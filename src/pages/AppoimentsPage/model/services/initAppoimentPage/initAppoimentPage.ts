import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { fetchAppoimentsList } from '../fetchAppoimentsList/fetchAppoimentsList';


export const initAppoimentPage = createAsyncThunk<
    void,
    URLSearchParams,
    ThunkConfig<string>
>(
    'clientsPage/initClientPage',
    async (searchParams, thunkApi) => {
        const { dispatch } = thunkApi;
        dispatch(fetchAppoimentsList({}));
    },
);
