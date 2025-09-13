import { EntityState } from '@reduxjs/toolkit';
import { Appointment } from 'entities/Appointment';
import { ClientSortField } from 'entities/Client';
import { SortOrder } from 'shared/types/sort';

export interface AppoimentPageSchema extends EntityState<Appointment, string> {
    isLoading?: boolean;
    error?: string;
    // for pagination
    page: number;
    order: SortOrder
    sort: ClientSortField
    
    limit?: number;
    hasMore: boolean;

    search?: string;

    _inited: boolean
}
