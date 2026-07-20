import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { Appointment } from '@/entities/Appointment';

interface UpdateAppointmentPayload {
    appointmentId: string;
    note?: string;
    createdAt?: string;
    startAt?: string;
    status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    clientConfirmed?: boolean;
    documentsChecklist?: string[];
    documentsLocked?: boolean;
    paymentMethod?: string;
    discountAmount?: number;
    finalAmount?: number;
    serviceItemIds?: number[];
}

export const updateAppointmentById = createAsyncThunk<
    Appointment,
    UpdateAppointmentPayload,
    ThunkConfig<string>
>(
    'appoimentsPage/updateAppointmentById',
    async (payload, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const { data } = await extra.apiPrivate.patch<Appointment>(
                `/appointments/${payload.appointmentId}`,
                {
                    note: payload.note,
                    createdAt: payload.createdAt,
                    startAt: payload.startAt,
                    status: payload.status,
                    clientConfirmed: payload.clientConfirmed,
                    documentsChecklist: payload.documentsChecklist,
                    documentsLocked: payload.documentsLocked,
                    paymentMethod: payload.paymentMethod,
                    discountAmount: payload.discountAmount,
                    finalAmount: payload.finalAmount,
                    serviceItemIds: payload.serviceItemIds,
                },
            );

            if (!data) {
                throw new Error();
            }

            return data;
        } catch (error) {
            return rejectWithValue('error');
        }
    },
);
