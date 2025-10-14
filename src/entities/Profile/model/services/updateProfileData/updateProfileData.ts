import { createAsyncThunk } from '@reduxjs/toolkit';
import { StateSchema, ThunkConfig } from '@/app/providers/StoreProvider';
import { IProfile, ValidateProfileError } from '../../types/profile';
import { getProfileForm } from '../../selectors/getProfileForm/getProfileForm';
import { validateProfileData } from '../validateProfileData/validateProfileData';
import { initAuthData } from '@/entities/User';

export const updateProfileData = createAsyncThunk<IProfile, void, ThunkConfig<ValidateProfileError[]>>(
    'profile/updateProfileData',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState, dispatch } = thunkApi;

        const formData = getProfileForm(getState() as StateSchema);
        const validateErrors = validateProfileData(formData);

        if (validateErrors.length) {
            return rejectWithValue(validateErrors);
        }

        try {
            const response = await extra.apiPrivate.put<IProfile>(`/profile/${formData?.id}`, formData);
            if (!response.data) {
                throw new Error();
            }

            dispatch(initAuthData());

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue([ValidateProfileError.SERVER_ERROR]);
        }
    }
);
