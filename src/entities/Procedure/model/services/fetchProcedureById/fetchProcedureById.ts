import { createAsyncThunk } from '@reduxjs/toolkit';
import { Procedure } from '../../types/procedure';
import { ThunkConfig } from 'app/providers/StoreProvider';

export const fetchProcedureById = createAsyncThunk<
    Procedure,
    string | undefined,
    ThunkConfig<string>
>('procedureDetails/fetchProcedureById', async (procedureId, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    if (!procedureId) {
        throw new Error('');
    }

    try {
        const { data } = await extra.apiPrivate.get<Procedure>(`/procedures/${procedureId}`);

        if (!data) {
            throw new Error();
        }

        return data;
    } catch (e) {
        console.log(e);
        return rejectWithValue('error');
    }
});
