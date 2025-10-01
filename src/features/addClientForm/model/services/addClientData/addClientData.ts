import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider';
import { Client } from 'entities/Client';
import { getAddClientForm } from '../../selectors/getAddClientForm/getAddClientForm';

interface ThunkArg {
    files?: File[] | null
}

export const addClientData = createAsyncThunk<Client, ThunkArg, ThunkConfig<string>>('client/addClientData', async ({ files }, thunkApi) => {
    const { extra, rejectWithValue, getState } = thunkApi;

    const clientForm = getAddClientForm(getState());

    if (!clientForm) {
        return rejectWithValue('Форма клиента не заполнена');
    }

    const formData = new FormData();

    Object.entries(clientForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    if (files && files.length > 0) {
        files.forEach((file) => {
            formData.append('images', file);
        });
    }

    try {
        const response = await extra.apiPrivate.post<Client>('/clients', formData, {
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
