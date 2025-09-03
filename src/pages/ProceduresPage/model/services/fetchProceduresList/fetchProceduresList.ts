import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Procedure } from 'entities/Procedure';


export const fetchProceduresList = createAsyncThunk<
    Procedure[],
    void,
    ThunkConfig<string>
>(
    'proceduresPage/fetchProceduresList',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const { data } = await extra.apiPrivate.get<Procedure[]>('/procedures');
            if (!data) {
                throw new Error();
            }

            return data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
