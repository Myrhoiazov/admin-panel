import React, { memo, useMemo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { ClientSortField } from 'entities/Client';
import s from './TransactionSortSelector.module.scss';
import { SortOrder } from 'shared/types/sort';
import { useTranslation } from 'react-i18next';
import { SelectOption } from 'shared/ui/Select/Select';
import { HStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text';
import { ListBox } from 'shared/ui/Popups';
import { TransactionSortField } from 'entities/Transaction';

interface TransactionSortSelectorProps {
    className?: string;
    sort: TransactionSortField;
    order: SortOrder;
    onChangeOrder: (newOrder: SortOrder) => void;
    onChangeSort: (newSort: TransactionSortField) => void;
}

export const TransactionSortSelector = memo((props: TransactionSortSelectorProps) => {
    const { className, onChangeOrder, onChangeSort, order, sort } = props;
    const { t } = useTranslation();

    const orderOptions = useMemo<SelectOption<SortOrder>[]>(
        () => [
            {
                value: '',
                content: t('Выбрать значение'),
            },
            {
                value: 'asc',
                content: t('возрастанию'),
            },
            {
                value: 'desc',
                content: t('убыванию'),
            },
        ],
        [t]
    );

    const sortFieldOptions = useMemo<SelectOption<TransactionSortField>[]>(
        () => [
            {
                value: TransactionSortField.ID,
                content: t('По номерации'),
            },
            {
                value: TransactionSortField.DATE,
                content: t('дате создания'),
            },
            {
                value: TransactionSortField.CATEGORY,
                content: t('по категории'),
            },
        ],
        [t]
    );

    return (
        <div className={classNames(s.TransactionSortSelector, {}, [className])}>
            <HStack gap="8" max>
                <Text text={t('Сортировать по:')} />
                <ListBox items={sortFieldOptions} value={sort} onChange={onChangeSort} />
                <ListBox items={orderOptions} value={order} onChange={onChangeOrder} />
            </HStack>
        </div>
    );
});
