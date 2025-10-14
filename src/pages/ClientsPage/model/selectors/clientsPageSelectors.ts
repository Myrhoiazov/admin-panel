import { StateSchema } from '@/app/providers/StoreProvider';
import { ClientSortField, ClientView } from '@/entities/Client';
import { ClientStatusKey } from '@/entities/ClientStatus';

export const getClientsPageIsLoading = (state: StateSchema) => state.clientsPage?.isLoading || false;
export const getClientsPageError = (state: StateSchema) => state.clientsPage?.error;
export const getClientsPageNum = (state: StateSchema) => state.clientsPage?.page || 1;
export const getClientsPageLimit = (state: StateSchema) => state.clientsPage?.limit || 9;
export const getClientsPageHasMore = (state: StateSchema) => state.clientsPage?.hasMore;
export const getClientsPageInited = (state: StateSchema) => state.clientsPage?._inited
export const getClientsPageView = (state: StateSchema) => state.clientsPage?.view || ClientView.BIG;
export const getClientsPageSearch = (state: StateSchema) =>
    state.clientsPage?.search ?? '';
export const getClientsPageSort = (state: StateSchema) =>
    state.clientsPage?.sort ?? ClientSortField.CREATED;
export const getClientsPageOrder = (state: StateSchema) =>
    state.clientsPage?.order ?? 'asc';
export const getClientsPageType = (state: StateSchema) =>
    state.clientsPage?.type || ClientStatusKey.all;
