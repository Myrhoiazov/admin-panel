import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Client } from 'entities/Client';


export const fetchClientsList = createAsyncThunk<
    Client[],
    void,
    ThunkConfig<string>
>(
    'addAppoimentForm/fetchClientsList',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState } = thunkApi;

        try {
            const { data } = await extra.apiPrivate.get<Client[]>('/clients');

            if (!data) {
                throw new Error();
            }

            return data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
