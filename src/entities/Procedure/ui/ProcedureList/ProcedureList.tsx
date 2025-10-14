import React, { memo, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './ProcedureList.module.scss';
import { Procedure } from '../../model/types/procedure';
import { Text } from '@/shared/ui/Text/Text';
import ProcedureItem from '../ProcedureItem/ProcedureItem';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { HStack } from '@/shared/ui/Stack';

interface ProcedureListProps {
    className?: string;
    procedures: Procedure[];
    isLoading?: boolean;
}

const getSkeletons = () =>
    new Array(5).fill(0).map((item, index) => <Skeleton key={index} width={300} height={300} />);

export const ProcedureList = memo((props: ProcedureListProps) => {
    const { className, procedures, isLoading } = props;

    const renderProcedure = useMemo(() => {
        return (procedure: Procedure) => (
            <ProcedureItem procedure={procedure} key={procedure.id} className={s.item} />
        );
    }, [procedures]);

    if (!isLoading && !procedures.length) {
        return (
            <div className={classNames(s.ProcedureList, {}, [])}>
                <Text text="Процедур не существует" />
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
