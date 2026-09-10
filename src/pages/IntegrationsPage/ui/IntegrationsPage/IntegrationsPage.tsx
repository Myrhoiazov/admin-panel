import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserAuthData } from '@/entities/User';
import { Page } from '@/widgets/Page/Page';
import { VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text/Text';
import { $apiPrivate } from '@/shared/api/api';
import { TelegramProviderCard } from '../TelegramProviderCard/TelegramProviderCard';
import { EmailProviderCard } from '../EmailProviderCard/EmailProviderCard';
import { NotificationSettingsCard } from '../NotificationSettingsCard/NotificationSettingsCard';
import { NotificationLogTable } from '../NotificationLogTable/NotificationLogTable';
import { IntegrationStatus } from '../../model/types/integration';
import s from './IntegrationsPage.module.scss';

interface IntegrationsPageProps {
    className?: string;
}

const IntegrationsPage = memo((props: IntegrationsPageProps) => {
    const { className } = props;
    const authData = useSelector(getUserAuthData);
    const [statuses, setStatuses] = useState<IntegrationStatus[]>([]);

    const load = useCallback(async () => {
        const { data } = await $apiPrivate.get<IntegrationStatus[]>('/integrations');
        setStatuses(data);
    }, []);

    useEffect(() => {
        if (authData?.isAdmin) load();
    }, [authData?.isAdmin, load]);

    if (!authData?.isAdmin) {
        return (
            <Page className={className}>
                <Text title="Нет доступа" size="l" bold />
            </Page>
        );
    }

    const telegramStatus = statuses.find((i) => i.type === 'TELEGRAM_BOT') ?? null;
    const emailStatus = statuses.find((i) => i.type === 'EMAIL') ?? null;

    return (
        <Page className={className}>
            <VStack gap="16">
                <Text title="Сервисы и провайдеры" size="l" bold />

                <div className={s.cards}>
                    <TelegramProviderCard status={telegramStatus} onSaved={load} />
                    <EmailProviderCard status={emailStatus} onSaved={load} />
                    <NotificationSettingsCard />
                    <NotificationLogTable />
                </div>
            </VStack>
        </Page>
    );
});

export default IntegrationsPage;
