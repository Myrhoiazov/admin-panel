import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Appointment } from 'entities/Appointment';

interface FetchAppointmentsListProps {
    replace?: boolean;
    noQuery?: boolean
}


export const fetchAppoimentsList = createAsyncThunk<
    Appointment[],
    FetchAppointmentsListProps,
    ThunkConfig<string>
>(
    'appoimentsPage/fetchAppoimentsList',
    async (noQuery, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const { data } = await extra.apiPrivate.get<Appointment[]>('/appointments');
            if (!data) {
                throw new Error();
            }

            return data;
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
