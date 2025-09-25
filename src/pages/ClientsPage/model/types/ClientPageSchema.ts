import { EntityState } from '@reduxjs/toolkit';
import { Client, ClientSortField, ClientView } from 'entities/Client';
import { ClientStatusKey } from 'entities/ClientStatus';
import { SortOrder } from 'shared/types/sort';

export interface ClientPageSchema extends EntityState<Client, string> {
    isLoading?: boolean;
    error?: string;

    // for pagination
    page: number;
    limit: number;
    hasMore: boolean;

    //filters
    view?: ClientView
    sort: ClientSortField
    order: SortOrder
    search: string;
    type: ClientStatusKey;

    _inited: boolean
}
