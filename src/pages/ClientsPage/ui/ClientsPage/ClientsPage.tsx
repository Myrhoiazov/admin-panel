import { classNames } from '@/shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
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
    getClientsPageIsLoading,
    getClientsPageView,
} from '../../model/selectors/clientsPageSelectors';
import { fetchNextClientsPage } from '../../model/services/fetchNextClientsPage/fetchNextClientsPage';
import { initClientsPage } from '../../model/services/initClientsPage/initClientsPage';
import { FiltersContainer } from '../FiltersContainer/FiltersContainer';
import { fetchClientsList } from '../../model/services/fetchClientsList/fetchClientsList';
import { EdditClientDropdown } from '@/features/edditClientDropdown';
import { Text } from '@/shared/ui/Text/Text';
import { HStack } from '@/shared/ui/Stack';
import { Page } from '@/widgets/Page/Page';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const onChangeView = useCallback(
        (view: ClientView) => {
            dispatch(clientsPageActions.setView(view));
        },
        [dispatch]
    );

    const onLoadNextPart = useCallback(() => {
        dispatch(fetchNextClientsPage());
    }, [dispatch]);

    useInitialEffect(() => {
        dispatch(initClientsPage(searchParams));
    });

    const fetchAllClients = useCallback(() => {
        dispatch(fetchClientsList({ replace: true, noQuery: true }));
    }, [dispatch]);

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={false}>
            <Page
                onScrollEnd={onLoadNextPart}
                className={classNames(cls.ClientsPage, {}, [className])}
            >
                <FiltersContainer reloadPage={fetchAllClients} />
                <HStack gap="16" align="center">
                    <Text title={t('ClientsList')} size="l" bold />
                    <ClientViewSelector view={view} onViewClick={onChangeView} />
                </HStack>
                <ClientList
                    view={view}
                    isLoading={isLoading}
                    clients={clients}
                    renderAction={(client: Client) => (
                        <EdditClientDropdown
                            clientId={client.id ?? ''}
                            reloadPage={fetchAllClients}
                        />
                    )}
                />
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(ClientsPage);
