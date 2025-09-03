import { useTranslation } from 'react-i18next';
import { memo, useCallback, useMemo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { ClientStatus } from 'entities/ClientStatus';
import { Tabs, TabItem } from 'shared/ui/Tabs';

interface ClientTypeTabsProps {
    className?: string;
    value: ClientStatus;
    onChangeType: (type: ClientStatus) => void;
}

export const ClientTypeTabs = memo((props: ClientTypeTabsProps) => {
    const { className, value, onChangeType } = props;
    const { t } = useTranslation();

    const typeTabs = useMemo<TabItem[]>(
        () => [
            {
                value: ClientStatus.ALL,
                content: t('Все клиенты'),
            },
            {
                value: ClientStatus.BRONZE,
                content: t('BRONZE'),
            },
            {
                value: ClientStatus.GOLD,
                content: t('GOLD'),
            },
            {
                value: ClientStatus.PLATINUM,
                content: t('PLATINUM'),
            },
            {
                value: ClientStatus.SILVER,
                content: t('SILVER'),
            },
        ],
        [t]
    );

    const onTabClick = useCallback(
        (tab: TabItem) => {
            onChangeType(tab.value as ClientStatus);
        },
        [onChangeType]
    );

    return (
        <Tabs
            direction="row"
            tabs={typeTabs}
            value={value}
            onTabClick={onTabClick}
            className={classNames('', {}, [className])}
        />
    );
});
