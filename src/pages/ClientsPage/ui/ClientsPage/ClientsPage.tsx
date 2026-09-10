import { classNames } from '@/shared/lib/classNames/classNames';
import { memo, useCallback, useMemo } from 'react';
import cls from './ClientsPage.module.scss';
import { Client, ClientList, ClientView, ClientViewSelector } from '@/entities/Client';
import {
    DynamicModuleLoader,
    ReducersList,
} from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import {
    clientsPageActions,
    clientsPageReducer,
    getClients,
} from '../../model/slices/clientsPageSlice';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { useInitialEffect } from '@/shared/lib/hooks/useInitialEffect/useInitialEffect';
import {
    getClientsPageLimit,
    getClientsPageIsLoading,
    getClientsPageNum,
    getClientsPageView,
} from '../../model/selectors/clientsPageSelectors';
import { initClientsPage } from '../../model/services/initClientsPage/initClientsPage';
import { FiltersContainer } from '../FiltersContainer/FiltersContainer';
import { fetchClientsList } from '../../model/services/fetchClientsList/fetchClientsList';
import { EdditClientDropdown } from '@/features/edditClientDropdown';
import { Text } from '@/shared/ui/Text/Text';
import { HStack } from '@/shared/ui/Stack';
import { Page } from '@/widgets/Page/Page';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from '@/features/pagination';

interface ClientsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    clientsPage: clientsPageReducer,
};

const ClientsPage = (props: ClientsPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const clients = useSelector(getClients.selectAll);
    const isLoading = useSelector(getClientsPageIsLoading);
    const view = useSelector(getClientsPageView);
    const page = useSelector(getClientsPageNum);
    const limit = useSelector(getClientsPageLimit);
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const onChangeView = useCallback(
        (view: ClientView) => {
            dispatch(clientsPageActions.setView(view));
        },
        [dispatch]
    );

    useInitialEffect(() => {
        dispatch(initClientsPage(searchParams));
    });

    const fetchAllClients = useCallback(() => {
        dispatch(clientsPageActions.setPage(1));
        dispatch(fetchClientsList({ replace: true, noQuery: true }));
    }, [dispatch]);

    const visibleClients = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return clients.slice(start, end);
    }, [clients, limit, page]);

    const from = clients.length ? (page - 1) * limit + 1 : 0;
    const to = (page - 1) * limit + visibleClients.length;

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <Page className={classNames(cls.ClientsPage, {}, [className])}>
                <div className={cls.pageInner}>
                    <HStack gap="16" align="center" className={cls.heading}>
                        <div>
                            <Text title={t('ClientsList')} size="l" bold />
                            <p className={cls.subtitle}>Управление базой данных ваших пациентов и клиентов</p>
                        </div>
                        <ClientViewSelector view={view} onViewClick={onChangeView} />
                    </HStack>
                    <FiltersContainer reloadPage={fetchAllClients} />
                    <ClientList
                        view={view}
                        isLoading={isLoading}
                        clients={visibleClients}
                        renderAction={(client: Client) => (
                            <EdditClientDropdown
                                clientId={client.id ?? ''}
                                reloadPage={fetchAllClients}
                            />
                        )}
                    />
                    <div className={cls.footerMetaRow}>
                        <div className={cls.footerMeta}>
                            Показано {from}-{to} из {clients.length}
                        </div>
                        <Pagination
                            totalItems={clients.length}
                            itemsPerPage={limit}
                            currentPage={page}
                            onPageChange={(nextPage) => dispatch(clientsPageActions.setPage(nextPage))}
                        />
                    </div>
                </div>
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ClientsPage);
