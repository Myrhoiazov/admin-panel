import { useTranslation } from 'react-i18next';
import { memo, useCallback, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { ClientStatusKey, ClientStatusLabels, useClientStatusLabels } from '@/entities/ClientStatus';
import { Tabs, TabItem } from '@/shared/ui/Tabs';

interface ClientTypeTabsProps {
    className?: string;
    value: ClientStatusKey;
    onChangeType: (type: ClientStatusKey) => void;
}

export const ClientTypeTabs = memo((props: ClientTypeTabsProps) => {
    const { className, value, onChangeType } = props;
    const { t } = useTranslation();
    const labels = useClientStatusLabels();

    const typeTabs = useMemo<TabItem[]>(
        () => [
            {
                value: ClientStatusKey.all,
                content: t(ClientStatusLabels.all),
            },
            {
                value: ClientStatusKey.BRONZE,
                content: labels.BRONZE,
            },
            {
                value: ClientStatusKey.SILVER,
                content: labels.SILVER,
            },
            {
                value: ClientStatusKey.GOLD,
                content: labels.GOLD,
            },
            {
                value: ClientStatusKey.PLATINUM,
                content: labels.PLATINUM,
            },
        ],
        [t, labels]
    );

    const onTabClick = useCallback(
        (tab: TabItem) => {
            onChangeType(tab.value as ClientStatusKey);
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
