import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './AppoimentList.module.scss';
import { VStack } from '@/shared/ui/Stack';
import ApoimentListItem from '../AppoimentListItem/AppoimentListItem';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { Appointment } from '../../model/types/appoiment';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import SessionsIcon from '@/shared/assets/icons/sessions.svg';

interface AppoimentListProps {
    className?: string;
    appoiments: Appointment[];
    isLoading?: boolean;
    renderAction?: (appoiment: Appointment) => ReactNode;
}

export const AppoimentList = memo((props: AppoimentListProps) => {
    const { className, isLoading, appoiments, renderAction } = props;

    if (!isLoading && !appoiments.length) {
        return (
            <div className={classNames(s.AppoimentList, {}, [className])}>
                <EmptyState
                    icon={SessionsIcon}
                    title="Сеансы не найдены"
                    description="Попробуйте изменить фильтры или создайте новую запись"
                />
            </div>
        );
    }

    const renderAppoiment = (appoiment: Appointment) => (
        <ApoimentListItem
            className={s.card}
            appoiment={appoiment}
            key={appoiment.id}
            renderAction={renderAction}
        />
    );

    return (
        <div className={classNames(s.AppoimentList, {}, [className])}>
            <VStack gap="16">
                <div className={s.headerRow}>
                    <span>#</span>
                    <span>Дата</span>
                    <span>Время</span>
                    <span>Статус</span>
                    <span>Клиент</span>
                    <span>Процедура</span>
                    <span>Доктор</span>
                    <span className={s.openCol}>Открыть</span>
                    <span className={s.openCol}>Удалить</span>
                </div>
                {appoiments.length > 0 ? appoiments.map(renderAppoiment) : null}
                {isLoading && <Skeleton width="100%" height={60} border="12px" />}
            </VStack>
        </div>
    );
});
