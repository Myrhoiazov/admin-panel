import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './AppoimentListItem.module.scss';
import { Card } from '@/shared/ui/Card/Card';
import { Appointment } from '../../model/types/appoiment';
import { Link } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { Icon } from '@/shared/ui/Icon/Icon';
import EyeIcon from '@/shared/assets/icons/eye-20-20.svg';

interface AppoimentListItemProps {
    className?: string;
    appoiment: Appointment;
    renderAction?: (appoiment: Appointment) => ReactNode;
}

const AppoimentListItem = (props: AppoimentListItemProps) => {
    const { className, appoiment, renderAction } = props;
    const startValue = appoiment?.startAt || appoiment?.createdAt;
    const startDate = startValue ? new Date(startValue) : null;
    const onlyDate = startDate && !Number.isNaN(startDate.getTime()) ? startDate.toISOString().slice(0, 10) : '-';
    const onlyTime = startDate && !Number.isNaN(startDate.getTime())
        ? startDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        : '--:--';
    const statusMap: Record<string, string> = {
        SCHEDULED: 'Запланирован',
        COMPLETED: 'Завершен',
        CANCELLED: 'Отменен',
        NO_SHOW: 'Не пришел',
    };
    const procedureNames = appoiment?.procedures?.map((p) => p.procedure?.name).filter(Boolean).join(', ') || '';
    const firstProcedureId = appoiment?.procedures?.[0]?.procedure?.id ?? appoiment?.procedures?.[0]?.procedureId;
    const statusKey = appoiment?.status || 'SCHEDULED';
    const status = statusMap[statusKey] || 'Запланирован';
    const statusClassMap: Record<string, string> = {
        SCHEDULED: s.statusScheduled,
        COMPLETED: s.statusCompleted,
        CANCELLED: s.statusCancelled,
        NO_SHOW: s.statusNoShow,
    };

    return (
        <Card
            padding="16"
            fullWidth
            shadow="shadowLight"
            className={classNames(s.AppoimentListItem, {}, [className])}
        >
            <div className={s.grid}>
                <p className={s.cell}>{appoiment.id}</p>
                <p className={s.cell}>{onlyDate}</p>
                <p className={s.cell}>{onlyTime}</p>
                <p className={classNames(s.cell, {}, [s.status, statusClassMap[statusKey]])}>{status}</p>
                <Link className={s.linkCell} to={`${RoutePath.client_details}${appoiment?.client?.id}`}>
                    {appoiment?.client?.firstName} {appoiment?.client?.lastName}
                </Link>
                <Link className={s.linkCell} to={`${RoutePath.procedures_details}${firstProcedureId ?? ''}`}>
                    {procedureNames}
                </Link>
                <Link className={s.linkCell} to={`${RoutePath.profile}${appoiment?.doctor?.id}`}>
                    {appoiment?.doctor?.firstName}
                </Link>
                <Link
                    className={classNames(s.linkCell, {}, [s.openIcon])}
                    to={`${RoutePath.appointment_details}${appoiment?.id}`}
                    aria-label="Открыть сеанс"
                    title="Открыть сеанс"
                >
                    <Icon Svg={EyeIcon} width={18} height={18} color="stroke" />
                </Link>
                <div className={s.actionCell}>
                    {renderAction?.(appoiment)}
                </div>
            </div>
        </Card>
    );
};

export default memo(AppoimentListItem);
