import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ClientListItem.module.scss';
import { Client, ClientView } from '../../model/types/client';
import { Card } from '@/shared/ui/Card/Card';
import { Text } from '@/shared/ui/Text/Text';
import { Icon } from '@/shared/ui/Icon/Icon';
import { Avatar } from '@/shared/ui/Avatar/Avatar';
import EyeIcon from '@/shared/assets/icons/eye-20-20.svg';
import { Link } from 'react-router-dom';
import { getRouteClientDetails } from '@/shared/const/router';
import { useClientStatusLabels } from '@/entities/ClientStatus';

interface ClientListItemProps {
    className?: string;
    client: Client;
    renderAction?: (client: Client) => ReactNode;
    view: ClientView;
}

const ClientListItem = (props: ClientListItemProps) => {
    const { className, client, view, renderAction } = props;
    const onlyDate = new Date(client?.createdAt as string).toISOString().slice(0, 10);
    const statusLabels = useClientStatusLabels();
    const statusLabel = client.status ? statusLabels[client.status] : 'Не определен';

    if (view === ClientView.SMALL) {
        return (
            <Card padding="0" className={classNames(s.ClientListItem, {}, [className, s[view]])}>
                <Link to={getRouteClientDetails(String(client.id))} className={s.smallCard}>
                    <Avatar
                        className={s.smallAvatar}
                        src={typeof client.image === 'string' ? client.image : undefined}
                        alt={client.firstName}
                        size={72}
                    />
                    <Text
                        title={`${client.firstName} ${client?.lastName}`}
                        className={s.smallName}
                        align="center"
                    />
                    <span className={classNames(s.status, {}, [s[String(client.status || '').toLowerCase()]])}>
                        {statusLabel}
                    </span>
                </Link>
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
            <div className={s.grid}>
                <p className={s.cell}>{client.id}</p>
                <p className={s.cell}>{onlyDate}</p>
                <p className={classNames(s.cell, {}, [s.nameCell])}>
                    {client.firstName} {client.lastName}
                </p>
                <p className={s.cell}>{client.email}</p>
                <span className={classNames(s.status, {}, [s[String(client.status || '').toLowerCase()]])}>
                    {statusLabel}
                </span>
                <div className={s.actions}>
                    <Link
                        className={s.openLink}
                        to={getRouteClientDetails(String(client.id))}
                        aria-label="Открыть клиента"
                        title="Открыть клиента"
                    >
                        <Icon Svg={EyeIcon} width={18} height={18} color="stroke" />
                    </Link>
                    {renderAction?.(client)}
                </div>
            </div>
        </Card>
    );
};

export default memo(ClientListItem);
