import { StateSchema } from "app/providers/StoreProvider";
import { TransactionSortField } from "entities/Transaction";
import { TransactionType } from "entities/TransactionType";

export const getTransactionPageIsLoading = (state: StateSchema) => state.transactionPage?.isLoading || false;
export const getTransactionPageData = (state: StateSchema) => state.transactionPage?.items || [];
export const getTransactionPageInited = (state: StateSchema) => state.transactionPage?._inited;
export const getTransactionPageSearch = (state: StateSchema) =>
    state.transactionPage?.search ?? '';
export const getTransactionPageSort = (state: StateSchema) =>
    state.transactionPage?.sort ?? TransactionSortField.DATE;
export const getTransactionPageOrder = (state: StateSchema) =>
    state.transactionPage?.order ?? 'asc';
export const getTransactionPageType = (state: StateSchema) =>
    state.transactionPage?.type || TransactionType.ALL;