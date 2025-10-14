import { StateSchema } from '@/app/providers/StoreProvider';

export const getUserToken = (state: StateSchema) => state.user.authData?.token || '';
