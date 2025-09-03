import React, { memo, ReactNode } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './ClientListItem.module.scss';
import { Client, ClientView } from '../../model/types/client';
import { HStack, VStack } from 'shared/ui/Stack';
import { Card } from 'shared/ui/Card/Card';
import { Text } from 'shared/ui/Text/Text';

interface ClientListItemProps {
    className?: string;
    client: Client;
    renderAction?: (client: Client) => ReactNode;
    view: ClientView;
}

const ClientListItem = (props: ClientListItemProps) => {
    const { className, client, view, renderAction } = props;
    const onlyDate = new Date(client?.createdAt as string).toISOString().slice(0, 10);

    if (view === ClientView.SMALL) {
        return (
            <Card className={classNames(s.ClientListItem, {}, [s[view]])}>
                <VStack>
                    <Text title={`${client.firstName} ${client?.lastName}`} />
                </VStack>
            </Card>
        );
    }

    return (
        <Card
            padding="16"
            fullWidth
            shadow="shadowLight"
            className={classNames(s.ClientListItem, {}, [className, s[view]])}
        >
            <HStack max justify="between">
                <HStack gap="48">
                    <p>{client.id}</p>
                    <p>{onlyDate}</p>
                    <p>
                        {client.firstName} {client.lastName}
                    </p>
                    <p>{client.email}</p>
                </HStack>
                {renderAction?.(client)}
            </HStack>
        </Card>
    );
};

export default memo(ClientListItem);
