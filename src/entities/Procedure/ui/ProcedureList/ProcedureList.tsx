import React, { memo, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ProcedureList.module.scss';
import { Procedure } from '../../model/types/procedure';
import ProcedureItem from '../ProcedureItem/ProcedureItem';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { HStack } from '@/shared/ui/Stack';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import ProceduresIcon from '@/shared/assets/icons/procedures.svg';

interface ProcedureListProps {
    className?: string;
    procedures: Procedure[];
    isLoading?: boolean;
    onDelete?: (id: string) => void;
}

const getSkeletons = () =>
    new Array(5).fill(0).map((item, index) => <Skeleton key={index} width={300} height={300} />);

export const ProcedureList = memo((props: ProcedureListProps) => {
    const { className, procedures, isLoading, onDelete } = props;

    const renderProcedure = useMemo(() => {
        return (procedure: Procedure) => (
            <ProcedureItem procedure={procedure} key={procedure.id} className={s.item} onDelete={onDelete} />
        );
    }, [procedures, onDelete]);

    if (!isLoading && !procedures.length) {
        return (
            <div className={classNames(s.ProcedureList, {}, [className])}>
                <EmptyState
                    icon={ProceduresIcon}
                    title="Процедуры не найдены"
                    description="Добавьте первую процедуру, чтобы она появилась в этом списке"
                />
            </div>
        );
    }

    return (
        <div className={classNames(s.ProcedureList, {}, [className])}>
            <HStack gap="16" wrap="wrap" align="stretch">
                {procedures.map(renderProcedure)}
            </HStack>

            {isLoading && (
                <HStack gap="16" wrap="wrap">
                    {getSkeletons()}
                </HStack>
            )}
        </div>
    );
});
