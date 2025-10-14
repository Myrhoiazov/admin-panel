import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './AppoimentList.module.scss';
import { Text } from '@/shared/ui/Text/Text';
import { VStack } from '@/shared/ui/Stack';
import ApoimentListItem from '../AppoimentListItem/AppoimentListItem';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { Appointment } from '../../model/types/appoiment';

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
            <div className={classNames(s.ArticleList, {}, [])}>
                <Text size="m" text="Сеансы не найдены" className={s.title} />
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
                {appoiments.length > 0 ? appoiments.map(renderAppoiment) : null}
                {isLoading && <Skeleton width="100%" height={60} border="12px" />}
            </VStack>
        </div>
    );
});
