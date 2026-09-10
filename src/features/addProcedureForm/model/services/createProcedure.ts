import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Procedure } from '@/entities/Procedure';
import { getProcedureFormData } from '../selectors/procedureForm';

interface ThunkArg {
    file?: File | null
}

export const createProcedure = createAsyncThunk<Procedure, ThunkArg, ThunkConfig<string>>('client/addClientData', async ({ file }, thunkApi) => {
    const { extra, rejectWithValue, getState } = thunkApi;

    const procedureForm = getProcedureFormData(getState());

    if (!procedureForm) {
        return rejectWithValue('Форма процедуры не заполнена');
    }

    const formData = new FormData();

    formData.append('name', procedureForm.name ?? '');
    formData.append('description', procedureForm.description ?? '');
    formData.append('durationType', procedureForm.durationType ?? 'MINUTES_60');
    formData.append('defaultDurationMin', String(procedureForm.defaultDurationMin ?? 60));
    formData.append('isFlexibleDuration', String(Boolean(procedureForm.isFlexibleDuration)));
    formData.append('basePrice', String(procedureForm.basePrice ?? 0));

    if (file) {
        formData.append('image', file);
    }

    const blocks = procedureForm.blocks;

    if (blocks) {
        Object.entries(blocks).forEach(([blockKey, blockValue]) => {
            if (!blockValue) return;

            switch (blockValue.type) {
                case 'price':
                    blockValue.blocks?.forEach((price, index) => {
                        if (price.zone && price.price) {
                            formData.append(`${blockKey}[${index}]`, price.zone);
                            formData.append(`${blockKey}[${index}]`, price.price?.toString() ?? '');
                        }
                    });
                    break;

                case 'preparations':
                case 'injectionZones':
                case 'results':
                case 'rehabilitations':
                case 'contraindications':
                    blockValue.blocks?.forEach((item: string, index: number) => {
                        formData.append(`${blockKey}[${index}]`, item);
                    });
                    break;

                default:
                    break;
            }
        });
    }

    try {
        const response = await extra.apiPrivate.post<Procedure>('/procedures', formData, {
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
