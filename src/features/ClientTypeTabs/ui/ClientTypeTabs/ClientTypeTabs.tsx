import { useTranslation } from 'react-i18next';
import { memo, useCallback, useMemo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { ClientStatusKey, ClientStatusLabels } from 'entities/ClientStatus';
import { Tabs, TabItem } from 'shared/ui/Tabs';

interface ClientTypeTabsProps {
    className?: string;
    value: ClientStatusKey;
    onChangeType: (type: ClientStatusKey) => void;
}

export const ClientTypeTabs = memo((props: ClientTypeTabsProps) => {
    const { className, value, onChangeType } = props;
    const { t } = useTranslation();

    const typeTabs = useMemo<TabItem[]>(
        () => [
            {
                value: ClientStatusKey.all,
                content: t(ClientStatusLabels.all),
            },
            {
                value: ClientStatusKey.bronze,
                content: t(ClientStatusLabels.bronze),
            },
            {
                value: ClientStatusKey.gold,
                content: t(ClientStatusLabels.gold),
            },
            {
                value: ClientStatusKey.silver,
                content: t(ClientStatusLabels.silver),
            },
        ],
        [t]
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
