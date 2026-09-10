import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './TransactionListItem.module.scss';
import { Transaction } from '../../model/types/transaction';
import { Card } from '@/shared/ui/Card/Card';
import { Text } from '@/shared/ui/Text/Text';
import { TransactionType } from '@/entities/TransactionType';
import { PaymentMethod } from '@/entities/PaymentMethod';

interface TransactionListItemProps {
    className?: string;
    transaction: Transaction;
    transactionLabels?: Record<string, string>;
    renderAction?: (appoiment: Transaction) => ReactNode;
}

const TransactionListItem = ({
    className,
    transaction,
    transactionLabels,
    renderAction,
}: TransactionListItemProps) => {
    const onlyDate = new Date(transaction?.date as string).toISOString().slice(0, 10);

    const paymentKey = transaction?.paymentMethod as unknown as keyof typeof PaymentMethod;
    const paymentMethodRaw = PaymentMethod[paymentKey];
    const categoryRaw = `${transaction.category || ''}`;
    const typeRaw = transaction.type === ('INCOME' as TransactionType.INCOME) ? 'INCOME' : 'EXPENSE';

    const paymentMethod = transactionLabels?.[transaction?.paymentMethod as string] || paymentMethodRaw;
    const category = transactionLabels?.[categoryRaw] || categoryRaw;
    const type = transactionLabels?.[typeRaw] || (typeRaw === 'INCOME' ? 'Приход' : 'Расход');

    return (
        <Card
            padding="16"
            fullWidth
            shadow="shadowLight"
            className={classNames(s.TransactionListItem, {}, [className])}
        >
            <div className={s.grid}>
                <Text className={s.cell} text={`#${transaction.id}`} />
                <Text className={s.cell} text={onlyDate} />
                <Text className={s.cell} text={category} />
                <Text className={s.cell} text={paymentMethod} />
                <Text className={s.cell} text={type} />
                <Text className={classNames(s.cell, {}, [s.amount])} text={`${transaction.amount} uah`} />
                <div className={s.action}>{renderAction?.(transaction)}</div>
            </div>
        </Card>
    );
};

export default memo(TransactionListItem);
