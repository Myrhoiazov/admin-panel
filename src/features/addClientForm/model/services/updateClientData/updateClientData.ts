import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Client } from '@/entities/Client';
import { getAddClientForm } from '../../selectors/getAddClientForm/getAddClientForm';

interface ThunkArg {
    clientId: string;
    file?: File | null;
}

export const updateClientData = createAsyncThunk<Client, ThunkArg, ThunkConfig<string>>(
    'client/updateClientData',
    async ({ clientId, file }, thunkApi) => {
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

        if (file) {
            formData.append('image', file);
        }

        try {
            const response = await extra.apiPrivate.patch<Client>(`/clients/${clientId}`, formData, {
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
    },
);

