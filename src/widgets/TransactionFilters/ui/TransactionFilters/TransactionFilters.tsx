import React, { memo, useCallback, useState } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './TransactionFilters.module.scss';
import { Button } from 'shared/ui/Button';
import { AddTransactionFormModal } from 'features/addTransactionForm';
import Plus from 'shared/assets/icons/plus.svg';
import { Icon } from 'shared/ui/Icon/Icon';
import { TransactionSortSelector } from 'features/TransactionSortSelector';
import { TransactionSortField } from 'entities/Transaction';
import { SortOrder } from 'shared/types/sort';
import { Input } from 'shared/ui/Input/Input';
import SearchIcon from 'shared/assets/icons/search.svg';
import { HStack } from 'shared/ui/Stack';
import { useTranslation } from 'react-i18next';

interface TransactionFiltersProps {
    className?: string;
    search: string;
    sort: TransactionSortField;
    order: SortOrder;
    reloadPage?: () => void;
    onChangeSearch: (value: string) => void;
    onChangeOrder: (newOrder: SortOrder) => void;
    onChangeSort: (newSort: TransactionSortField) => void;
}

export const TransactionFilters = memo((props: TransactionFiltersProps) => {
    const {
        className,
        onChangeSearch,
        search,
        onChangeSort,
        sort,
        onChangeOrder,
        order,
        reloadPage,
    } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();

    const onShowModal = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <div className={classNames(s.TransactionFilters, {}, [className])}>
            <HStack gap="32" justify="end" align="center" max>
                <Input
                    onChange={onChangeSearch}
                    value={search}
                    size="s"
                    placeholder="Поиск"
                    addonLeft={<Icon Svg={SearchIcon} />}
                />
                <TransactionSortSelector
                    sort={sort}
                    order={order}
                    onChangeOrder={onChangeOrder}
                    onChangeSort={onChangeSort}
                />
                <Button onClick={onShowModal} className={s.btn}>
                    {t('Создать ')} <Icon Svg={Plus} width={24} color="stroke" />
                </Button>
            </HStack>

            <AddTransactionFormModal
                isOpen={isModalOpen}
                onClose={onCloseModal}
                reloadPage={reloadPage}
            />
        </div>
    );
});
