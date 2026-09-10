import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';

export const deleteProcedure = createAsyncThunk<string, string, ThunkConfig<string>>(
    'proceduresPage/deleteProcedure',
    async (id, { extra, rejectWithValue }) => {
        try {
            await extra.apiPrivate.delete(`/procedures/${id}`);
            return id;
        } catch {
            return rejectWithValue('error');
        }
    },
);
