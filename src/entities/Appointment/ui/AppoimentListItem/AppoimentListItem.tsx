import React, { memo, ReactNode } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './AppoimentListItem.module.scss';
import { HStack } from 'shared/ui/Stack';
import { Card } from 'shared/ui/Card/Card';
import { Appointment } from '../../model/types/appoiment';
import { Link } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';

interface AppoimentListItemProps {
    className?: string;
    appoiment: Appointment;
    renderAction?: (appoiment: Appointment) => ReactNode;
}

const AppoimentListItem = (props: AppoimentListItemProps) => {
    const { className, appoiment, renderAction } = props;
    const onlyDate = new Date(appoiment?.createdAt as string).toISOString().slice(0, 10);

    return (
        <Card
            padding="16"
            fullWidth
            shadow="shadowLight"
            className={classNames(s.AppoimentListItem, {}, [className])}
        >
            <HStack max justify="between">
                <HStack gap="48">
                    <p>{appoiment.id}</p>
                    <p>{onlyDate}</p>
                    <Link to={`${RoutePath.client_details}${appoiment?.client?.id}`}>
                        {appoiment?.client?.firstName} {appoiment?.client?.lastName}
                    </Link>
                    <Link to={`${RoutePath.procedures_details}${appoiment?.procedure?.id}`}>
                        {appoiment?.procedure?.name}
                    </Link>
                    <Link to={`${RoutePath.profile}${appoiment?.doctor?.id}`}>
                        {appoiment?.doctor?.firstName}
                    </Link>
                </HStack>
                {renderAction?.(appoiment)}
            </HStack>
        </Card>
    );
};

export default memo(AppoimentListItem);
