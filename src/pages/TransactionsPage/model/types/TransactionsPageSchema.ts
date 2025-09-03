import { EntityState } from "@reduxjs/toolkit";
import { Summary } from "entities/Summary";
import { Transaction, TransactionSortField } from "entities/Transaction";
import { TransactionType } from "entities/TransactionType";
import { SortOrder } from "shared/types/sort";

export interface TransactionsPageSchema extends EntityState<Transaction, string> {
    isLoading?: boolean;
    error?: string;
    items?: Transaction[];
    summary?: Summary

    // for pagination
    page: number;
    limit: number;
    hasMore: boolean;

    //filters
    sort: TransactionSortField
    order: SortOrder
    search: string;
    type: TransactionType;

    _inited: boolean
}