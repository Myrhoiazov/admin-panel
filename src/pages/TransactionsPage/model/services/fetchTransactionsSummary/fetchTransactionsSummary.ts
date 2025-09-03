import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Summary } from 'entities/Summary';


export const fetchTransactionsSummary = createAsyncThunk<
    Summary,
    void,
    ThunkConfig<string>
>(
    'summaryPage/fetchTransactionsSummary',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const { data } = await extra.apiPrivate.get<Summary>('/transactions/summary')

            if (!data) {
                throw new Error('error');
            }

            return data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
