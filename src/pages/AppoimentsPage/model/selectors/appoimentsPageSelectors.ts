import { StateSchema } from 'app/providers/StoreProvider';
import { ClientSortField, ClientView } from 'entities/Client';
import { ClientStatus } from 'entities/ClientStatus';

export const getAppoimentPageIsLoading = (state: StateSchema) => state.appoimentPage?.isLoading || false;
export const getAppoimentPageError = (state: StateSchema) => state.appoimentPage?.error;
export const getAppoimentPageNum = (state: StateSchema) => state.appoimentPage?.page || 1;
export const getAppoimentPageLimit = (state: StateSchema) => state.appoimentPage?.limit || 9;
export const getAppoimentPageHasMore = (state: StateSchema) => state.appoimentPage?.hasMore;
export const getAppoimentPageInited = (state: StateSchema) => state.appoimentPage?._inited;
export const getAppoimentPageSearch = (state: StateSchema) =>
    state.appoimentPage?.search ?? '';
export const getAppoimentPageSort = (state: StateSchema) =>
    state.appoimentPage?.sort ?? ClientSortField.CREATED;
export const getAppoimentPageOrder = (state: StateSchema) =>
    state.appoimentPage?.order ?? 'asc';
