import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Appointment } from '@/entities/Appointment';

export const fetchAppoimentsByClientId = createAsyncThunk<
    Appointment,
    string | undefined,
    ThunkConfig<string>
>(
    'appoimentDetails/fetchAppoimentsByClientId',
    async (entityId, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        if (!entityId) {
            return rejectWithValue('error');
        }

        try {
            const { data } = await extra.apiPrivate.get<Appointment>(`/appointments/${entityId}`);

            if (!data) {
                throw new Error();
            }

            return data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
