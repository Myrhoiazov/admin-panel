import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
    getClientsPageOrder,
    getClientsPageSearch,
    getClientsPageSort,
    getClientsPageType,
} from '../../model/selectors/clientsPageSelectors';
import { useDebounce } from 'shared/lib/hooks/useDebounce/useDebounce';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { ClientSortField } from 'entities/Client';
import { SortOrder } from 'shared/types/sort';
import { clientsPageActions } from '../../model/slices/clientsPageSlice';
import { fetchClientsList } from '../../model/services/fetchClientsList/fetchClientsList';
import { ClientStatusKey } from 'entities/ClientStatus';

export function useClientFilters() {
    const search = useSelector(getClientsPageSearch);
    const sort = useSelector(getClientsPageSort);
    const order = useSelector(getClientsPageOrder);
    const type = useSelector(getClientsPageType);

    const dispatch = useAppDispatch();

    const fetchData = useCallback(() => {
        dispatch(fetchClientsList({ replace: true }));
    }, [dispatch]);

    const debouncedFetchData = useDebounce(fetchData, 500);

    const onChangeSearch = useCallback(
        (search: string) => {
            dispatch(clientsPageActions.setSearch(search));
            // dispatch(articlesPageActions.setPage(1));
            debouncedFetchData();
        },
        [dispatch, debouncedFetchData],
    );

    const onChangeSort = useCallback(
        (newSort: ClientSortField) => {
            dispatch(clientsPageActions.setSort(newSort));
            // dispatch(articlesPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    const onChangeOrder = useCallback(
        (newOrder: SortOrder) => {
            dispatch(clientsPageActions.setOrder(newOrder));
            // dispatch(articlesPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    const onChangeType = useCallback(
        (value: ClientStatusKey) => {
            dispatch(clientsPageActions.setType(value));
            // dispatch(articlesPageActions.setPage(1));
            fetchData();
        },
        [dispatch, fetchData],
    );

    return {
        search,
        sort,
        order,
        type,
        onChangeSearch,
        onChangeOrder,
        onChangeSort,
        onChangeType
    };
}
