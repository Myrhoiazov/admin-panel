import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { ClientSortField } from '@/entities/Client';
import { SortOrder } from '@/shared/types/sort';
import { getAppoimentPageOrder, getAppoimentPageSearch, getAppoimentPageSort } from '../../model/selectors/appoimentsPageSelectors';
import { appoimentsPageActions } from '../../model/slices/appoimentsPageSlice';
import { fetchAppoimentsList } from '../../model/services/fetchAppoimentsList/fetchAppoimentsList';
import { ClientStatusKey } from '@/entities/ClientStatus';

export function useAppoimentFilters() {
    const search = useSelector(getAppoimentPageSearch);
    const sort = useSelector(getAppoimentPageSort);
    const order = useSelector(getAppoimentPageOrder);
    // const type = useSelector(getAppoimentPageType);

    const dispatch = useAppDispatch();

    const fetchData = useCallback(() => {
        dispatch(fetchAppoimentsList({ replace: true }));
    }, [dispatch]);

    const debouncedFetchData = useDebounce(fetchData, 500);

    const onChangeSearch = useCallback(
        (search: string) => {
            dispatch(appoimentsPageActions.setSearch(search));
            // dispatch(articlesPageActions.setPage(1));
            debouncedFetchData();
        },
        [dispatch, debouncedFetchData],
    );

    const onChangeSort = useCallback(
        (newSort: ClientSortField) => {
            dispatch(appoimentsPageActions.setSort(newSort));
            // dispatch(articlesPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    const onChangeOrder = useCallback(
        (newOrder: SortOrder) => {
            dispatch(appoimentsPageActions.setOrder(newOrder));
            // dispatch(articlesPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    const onChangeType = useCallback(
        (value: ClientStatusKey) => {
            // dispatch(appoimentsPageActions.setType(value));
            // dispatch(articlesPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    return {
        search,
        order,
        sort,
        onChangeSearch,
        onChangeOrder,
        onChangeType,
        onChangeSort
    };
}
