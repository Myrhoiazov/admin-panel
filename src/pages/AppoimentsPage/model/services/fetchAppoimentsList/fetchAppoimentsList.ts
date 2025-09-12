import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Appointment } from 'entities/Appointment';
import { getAppoimentPageSearch } from '../../slectors/appoimentsPageSelectors';
import { addQueryParams } from 'shared/lib/url/addQueryParams/addQueryParams';

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
        const { extra, rejectWithValue, getState } = thunkApi;

        const search = getAppoimentPageSearch(getState());

        addQueryParams({
            search,
        });


        try {
            const { data } = await extra.apiPrivate.get<Appointment[]>('/appointments', {
                params: {
                    _q: search
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
