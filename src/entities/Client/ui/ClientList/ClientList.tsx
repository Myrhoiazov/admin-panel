import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ClientList.module.scss';
import { Client, ClientView } from '../../model/types/client';
import { Text } from '@/shared/ui/Text/Text';
import { HStack, VStack } from '@/shared/ui/Stack';
import ClientListItem from '../ClientListItem/ClientListItem';
import ClientListHeader from '../ClientListHeader/ClientListHeader';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';

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
            <div className={classNames(s.ArticleList, {}, [])}>
                <Text size="l" title="Клиенты не найдены" className={s.title} />
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
            <HStack gap="16" className={classNames(s.ClientList, {}, [className])}>
                {clients.length > 0 ? clients.map(renderClient) : null}
                {isLoading && <Skeleton width="100%" height={60} border="12px" />}
            </HStack>
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
