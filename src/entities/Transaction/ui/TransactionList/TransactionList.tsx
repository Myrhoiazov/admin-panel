import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './TransactionList.module.scss';
import { Transaction } from '../../model/types/transaction';
import TransactionListItem from '../TransactionListItem/TransactionListItem';
import { VStack } from '@/shared/ui/Stack';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState/EmptyState';
import TransactionsIcon from '@/shared/assets/icons/transactions.svg';

interface TransactionListProps {
    className?: string;
    transactions: Transaction[];
    isLoading?: boolean;
    transactionLabels?: Record<string, string>;
    renderAction?: (transaction: Transaction) => ReactNode;
}

export const TransactionList = memo((props: TransactionListProps) => {
    const { className, transactions, isLoading, renderAction, transactionLabels } = props;

    if (!isLoading && !transactions.length) {
        return (
            <div className={classNames(s.TransactionList, {}, [className])}>
                <EmptyState
                    icon={TransactionsIcon}
                    title="Транзакции не найдены"
                    description="Попробуйте изменить параметры фильтра"
                />
            </div>
        );
    }

    const renderTransactions = (trans: Transaction) => (
        <TransactionListItem
            className={s.card}
            transaction={trans}
            transactionLabels={transactionLabels}
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
