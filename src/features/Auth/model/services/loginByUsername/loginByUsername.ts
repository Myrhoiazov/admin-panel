import { createAsyncThunk } from '@reduxjs/toolkit';
import { User, userActions } from '@/entities/User';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import axios from 'axios';

interface LoginByEmailProps {
    email: string;
    password: string;
}

interface ServerError {
    status: number;
    message?: string;
}

export const loginByUsername = createAsyncThunk<User, LoginByEmailProps, ThunkConfig<ServerError>>(
    'login/loginByEmail',
    async (authData, thunkAPI) => {
        const { dispatch, extra, rejectWithValue, } = thunkAPI
        try {
            const response = await extra.api.post<User>('/auth/login', authData);

            if (!response.data) {
                throw new Error('No token received');
            }

            dispatch(userActions.setAuthData(response.data));
            return response.data;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status || 500;
                return rejectWithValue({ status, message: error.message });
            }

            return rejectWithValue({ status: 500, message: 'Unknown error' });
        }
    },
);
