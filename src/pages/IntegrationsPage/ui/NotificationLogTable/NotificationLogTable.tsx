import { memo, useCallback, useEffect, useState } from 'react';
import { Text } from '@/shared/ui/Text/Text';
import { Button, ButtonTheme } from '@/shared/ui/Button';
import { $apiPrivate } from '@/shared/api/api';
import {
    NOTIFICATION_CHANNEL_LABELS,
    NOTIFICATION_EVENT_LABELS,
    NotificationLogEntry,
} from '../../model/types/notification';
import s from './NotificationLogTable.module.scss';

export const NotificationLogTable = memo(() => {
    const [logs, setLogs] = useState<NotificationLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await $apiPrivate.get<NotificationLogEntry[]>('/notifications/log');
            setLogs(data);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div className={s.configCard}>
            <div className={s.cardHeader}>
                <Text title="Журнал уведомлений" bold />
                <p className={s.cardHint}>Последние отправленные уведомления админам.</p>
            </div>

            <div className={s.tableHead}>
                <span>Тип</span>
                <span>Канал</span>
                <span>Статус</span>
                <span>Когда</span>
            </div>

            {logs.length === 0 && !isLoading && <p className={s.empty}>Пока нет отправленных уведомлений</p>}

            {logs.map((log) => (
                <div key={log.id} className={s.row}>
                    <span>{NOTIFICATION_EVENT_LABELS[log.eventType] ?? log.eventType}</span>
                    <span>{NOTIFICATION_CHANNEL_LABELS[log.channel] ?? log.channel}</span>
                    <span className={log.status === 'SENT' ? s.statusSent : s.statusFailed}>
                        {log.status === 'SENT' ? '✓ Отправлено' : '✗ Ошибка'}
                    </span>
                    <span>{new Date(log.createdAt).toLocaleString('ru-RU')}</span>
                </div>
            ))}

            <Button theme={ButtonTheme.CLEAR} onClick={load} disabled={isLoading}>
                {isLoading ? 'Обновление...' : 'Обновить'}
            </Button>
        </div>
    );
});
