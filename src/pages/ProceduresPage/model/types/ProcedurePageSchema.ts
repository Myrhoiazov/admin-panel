import { EntityState } from '@reduxjs/toolkit';
import { Procedure } from 'entities/Procedure';
import { SortOrder } from 'shared/types/sort';

export interface ProcedurePageSchema extends EntityState<Procedure, string> {
    isLoading?: boolean;
    error?: string;
    // for pagination
    page: number;
    order: SortOrder
    limit?: number;
    hasMore: boolean;

    search: string;

    _inited: boolean
}
