import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { userActions } from '../slice/userSlice';

export const logout = createAsyncThunk<void, void, ThunkConfig<string>>(
    'user/initAuthData',
    async (_, thunkApi) => {
        const { rejectWithValue, extra, dispatch } = thunkApi;

        try {
            await extra.apiPrivate.get('/auth/logout');
            dispatch(userActions.logout());
        } catch (error: any) {
            dispatch(userActions.logout());
            return rejectWithValue('REFRESH_FAILED');
        }
    }
);
