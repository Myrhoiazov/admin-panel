import React, { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import s from './TransactionListItem.module.scss';
import { Transaction } from '../../model/types/transaction';
import { Card } from '@/shared/ui/Card/Card';
import { HStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { TransactionType } from '@/entities/TransactionType';
import { PaymentMethod } from '@/entities/PaymentMethod';

interface TransactionListItemProps {
    className?: string;
    transaction: Transaction;
    renderAction?: (appoiment: Transaction) => ReactNode;
}

const TransactionListItem = ({
    className,
    transaction,
    renderAction,
}: TransactionListItemProps) => {
    const onlyDate = new Date(transaction?.date as string).toISOString().slice(0, 10);

    const paymentKey = transaction?.paymentMethod as unknown as keyof typeof PaymentMethod;
    const paymentMethod = PaymentMethod[paymentKey];

    return (
        <Card
            padding="16"
            fullWidth
            shadow="shadowLight"
            className={classNames(s.TransactionListItem, {}, [className])}
        >
            <HStack max justify="between" gap="48">
                <HStack max gap="48" justify="between">
                    <Text text={`#${transaction.id}`} />
                    <Text text={`${onlyDate}`} />
                    <Text text={`${transaction.category}`} />
                    <Text text={`${paymentMethod}`} />
                    <Text
                        text={`${transaction.type === ('INCOME' as TransactionType.INCOME) ? 'Приход' : 'Расход'}`}
                    />
                </HStack>
                <Text text={`${transaction.amount}uah`} />
                {renderAction?.(transaction)}
            </HStack>
        </Card>
    );
};

export default memo(TransactionListItem);
