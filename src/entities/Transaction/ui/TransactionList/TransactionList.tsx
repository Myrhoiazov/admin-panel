import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './TransactionList.module.scss';
import { Transaction } from '../../model/types/transaction';
import TransactionListItem from '../TransactionListItem/TransactionListItem';
import { VStack } from '@/shared/ui/Stack';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { Text } from '@/shared/ui/Text/Text';

interface TransactionListProps {
    className?: string;
    transactions: Transaction[];
    isLoading?: boolean;
    renderAction?: (transaction: Transaction) => ReactNode;
}

export const TransactionList = memo((props: TransactionListProps) => {
    const { className, transactions, isLoading, renderAction } = props;

    if (!isLoading && !transactions.length) {
        return (
            <div className={classNames(s.TransactionList, {}, [])}>
                <Text size="l" title="Транзакции не найдены" className={s.title} />
            </div>
        );
    }

    const renderTransactions = (trans: Transaction) => (
        <TransactionListItem
            className={s.card}
            transaction={trans}
            key={trans.id}
            renderAction={renderAction}
        />
    );

    return (
        <div className={classNames(s.TransactionList, {}, [className])}>
            <VStack gap="16">
                {transactions.length > 0 ? transactions.map(renderTransactions) : null}
                {isLoading && <Skeleton width="100%" height={60} border="12px" />}
            </VStack>
        </div>
    );
});
