import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ClientList.module.scss';
import { Client, ClientView } from '../../model/types/client';
import { VStack } from '@/shared/ui/Stack';
import ClientListItem from '../ClientListItem/ClientListItem';
import ClientListHeader from '../ClientListHeader/ClientListHeader';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import ClientsIcon from '@/shared/assets/icons/clients.svg';

interface ClientListProps {
    className?: string;
    clients: Client[];
    isLoading?: boolean;
    renderAction?: (client: Client) => ReactNode;
    view: ClientView;
}

export const ClientList = memo((props: ClientListProps) => {
    const { className, view, isLoading, clients, renderAction } = props;

    if (!isLoading && !clients.length) {
        return (
            <div className={classNames(s.ClientList, {}, [className])}>
                <EmptyState
                    icon={ClientsIcon}
                    title="Клиенты не найдены"
                    description="Попробуйте изменить параметры поиска или добавьте первого клиента"
                />
            </div>
        );
    }

    const renderClient = (client: Client) => (
        <ClientListItem
            className={s.card}
            client={client}
            key={client.id}
            view={view}
            renderAction={renderAction}
        />
    );

    if (view === ClientView.SMALL) {
        return (
            <div className={classNames(s.ClientList, {}, [className])}>
                <div className={s.grid}>
                    {clients.length > 0 ? clients.map(renderClient) : null}
                    {isLoading && <Skeleton width="100%" height={180} border="16px" />}
                </div>
            </div>
        );
    }

    return (
        <div className={classNames(s.ClientList, {}, [className])}>
            <ClientListHeader />
            <VStack gap="16">
                {clients.length > 0 ? clients.map(renderClient) : null}
                {isLoading && <Skeleton width="100%" height={60} border="12px" />}
            </VStack>
        </div>
    );
});
