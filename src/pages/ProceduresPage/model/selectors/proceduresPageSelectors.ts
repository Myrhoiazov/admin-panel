import { StateSchema } from '@/app/providers/StoreProvider';
import { ClientSortField } from '@/entities/Client';
// import { ClientView } from 'entities/Client';

export const getProceduresPageIsLoading = (state: StateSchema) => state.proceduresPage?.isLoading || false;
export const getProceduresPageError = (state: StateSchema) => state.proceduresPage?.error;
export const getProceduresPageNum = (state: StateSchema) => state.proceduresPage?.page || 1;
export const getProceduresPageLimit = (state: StateSchema) => state.proceduresPage?.limit || 9;
export const getProceduresPageHasMore = (state: StateSchema) => state.proceduresPage?.hasMore;
export const getProceduresPageInited = (state: StateSchema) => state.proceduresPage?._inited
export const getProceduresPageSearch = (state: StateSchema) =>
    state.proceduresPage?.search ?? '';
export const getProceduresPageOrder = (state: StateSchema) =>
    state.proceduresPage?.order ?? 'asc';
