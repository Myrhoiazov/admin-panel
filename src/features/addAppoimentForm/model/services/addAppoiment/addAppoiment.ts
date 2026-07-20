import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { getAddAppoimentForm } from '../../selectors/getAddAppoimentForm/getAddClientForm';
import { Appointment } from '@/entities/Appointment';

interface ThunkArg {
    data?: Partial<Appointment> & { serviceItemIds?: number[] }
}

export const addAppoiment = createAsyncThunk<Appointment, ThunkArg, ThunkConfig<string>>('appoiment/addAppoiment', async ({ data }, thunkApi) => {
    const { extra, rejectWithValue, getState } = thunkApi;

    const { serviceItemIds, ...appoimentForm } = {
        ...getAddAppoimentForm(getState()),
        ...data,
    };

    if (!appoimentForm) {
        return rejectWithValue('Форма записи не заполнена');
    }

    const formData = new FormData();

    Object.entries(appoimentForm).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    // FormData can't carry a real array — the generic loop above would stringify it as "1,2,3".
    // Send it as a JSON string instead; the server does JSON.parse on this specific field.
    if (serviceItemIds !== undefined) {
        formData.append('serviceItemIds', JSON.stringify(serviceItemIds));
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
