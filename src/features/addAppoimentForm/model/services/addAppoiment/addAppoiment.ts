import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { getAddAppoimentForm } from '../../selectors/getAddAppoimentForm/getAddClientForm';
import { Appointment } from 'entities/Appointment';

interface ThunkArg {
    files?: File[] | null
}

export const addAppoiment = createAsyncThunk<Appointment, ThunkArg, ThunkConfig<string>>('appoiment/addAppoiment', async ({ files }, thunkApi) => {
    const { extra, rejectWithValue, getState } = thunkApi;

    const appoimentForm = getAddAppoimentForm(getState());

    if (!appoimentForm) {
        return rejectWithValue('Форма записи не заполнена');
    }

    const formData = new FormData();

    Object.entries(appoimentForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    if (files) {
        files.forEach((file) => {
            formData.append('image', file);
        });
    }

    try {
        const response = await extra.apiPrivate.post<Appointment>('/appointments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.data) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        console.log(e);
        return rejectWithValue('error');
    }
});
