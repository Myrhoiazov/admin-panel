import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User } from '@/entities/User';


export const fetchDoctorsList = createAsyncThunk<
    User[],
    void,
    ThunkConfig<string>
>(
    'addAppoimentForm/fetchDoctorsList',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const { data } = await extra.apiPrivate.get<User[]>('/users');
            if (!data) {
                throw new Error();
            }

            return data
                .filter((user) => user.isDoctor)
                .map((user) => ({ ...user, id: String(user.id) }));
        } catch (e) {
            return rejectWithValue('error');
        }
    },
);
