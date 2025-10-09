import { StateSchema } from 'app/providers/StoreProvider';
import { ClientSortField } from 'entities/Client';

export const getAppoimetDetailsIsLoading = (state: StateSchema) => state.appoimentDetails?.isLoading || false;
export const getAppoimetDetailsError = (state: StateSchema) => state.appoimentDetails?.error;
export const getAppoimetDetailsPageData = (state: StateSchema) => state.appoimentDetails?.data || undefined
