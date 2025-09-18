import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from 'shared/lib/classNames/classNames';
import s from './AppoimentFilters.module.scss';
import { HStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input';
import { Icon } from 'shared/ui/Icon/Icon';
import SearchIcon from 'shared/assets/icons/search.svg';
import { ClientSortSelector } from 'features/ClientSortSelector';
import { ClientSortField } from 'entities/Client';
import { SortOrder } from 'shared/types/sort';
import { Button, ButtonTheme } from 'shared/ui/Button';
import { AppoimentFormModal } from 'features/addAppoimentForm';
import Sessions from 'shared/assets/icons/sessions.svg';

interface AppoimentFiltersProps {
    className?: string;
    search: string;
    sort: ClientSortField;
    order: SortOrder;
    reloadPage?: () => void;
    onChangeSearch: (value: string) => void;
    onChangeOrder: (newOrder: SortOrder) => void;
    onChangeSort: (newSort: ClientSortField) => void;
}

export const AppoimentFilters = memo((props: AppoimentFiltersProps) => {
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
    const [isAddClientModal, setIsAddClientModal] = useState(false);

    const onCloseModal = useCallback(() => {
        setIsAddClientModal(false);
    }, []);

    const onShowModal = useCallback(() => {
        setIsAddClientModal(true);
    }, []);

    const { t } = useTranslation();

    return (
        <div className={classNames(s.ClientFilters, {}, [className])}>
            <HStack gap="32" justify="end" align="center" max>
                <Input
                    onChange={onChangeSearch}
                    value={search}
                    size="s"
                    placeholder={t('Поиск')}
                    addonLeft={<Icon Svg={SearchIcon} />}
                />
                <ClientSortSelector
                    order={order}
                    sort={sort}
                    onChangeOrder={onChangeOrder}
                    onChangeSort={onChangeSort}
                />

                <Button onClick={onShowModal} className={s.btn}>
                    {t('Создать запись')}
                    <Icon Svg={Sessions} width={24} color="fill" />
                </Button>
            </HStack>
            <AppoimentFormModal
                isOpen={isAddClientModal}
                onClose={onCloseModal}
                reloadPage={reloadPage}
            />
        </div>
    );
});
